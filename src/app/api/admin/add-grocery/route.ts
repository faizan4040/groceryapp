import { auth } from "@/auth";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { uploadOnCloudinary } from "@/lib/cloudinary";
import Grocery, { UNITS, IVariant } from "@/models/grocery.models";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

/**
 * Create a product with one or more pack-size variants.
 *
 * multipart/form-data:
 *   name, category, description?    product details
 *   image                           main product photo (required)
 *   variants                        JSON: [{ quantity, unit, price, discount?, stock }]
 *                                   price = MRP before discount; first row is the default
 *   variantImage_<index>            optional photo for that variant
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ message: "You are not admin" }, { status: 403 });
    }

    const form = await req.formData();
    const name = String(form.get("name") ?? "").trim();
    const category = String(form.get("category") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const image = form.get("image");

    /* ── product fields ── */
    if (!name || !category) {
      return NextResponse.json({ message: "Name and category are required" }, { status: 400 });
    }
    const imgError = checkImage(image, "Main image");
    if (imgError) return NextResponse.json({ message: imgError }, { status: 400 });

    /* ── variants ── */
    let rawVariants: any[];
    try {
      rawVariants = JSON.parse(String(form.get("variants") ?? "[]"));
    } catch {
      return NextResponse.json({ message: "Invalid variants data" }, { status: 400 });
    }
    if (!Array.isArray(rawVariants) || rawVariants.length === 0) {
      return NextResponse.json({ message: "Add at least one variant (size, price, stock)" }, { status: 400 });
    }
    if (rawVariants.length > 20) {
      return NextResponse.json({ message: "A product can have at most 20 variants" }, { status: 400 });
    }

    const seen = new Set<string>();
    const parsed: (Omit<IVariant, "image"> & { file?: File })[] = [];

    for (let i = 0; i < rawVariants.length; i++) {
      const v = rawVariants[i] ?? {};
      const row = `Variant ${i + 1}`;
      const quantity = Number(v.quantity);
      const unit = String(v.unit ?? "");
      const mrp = Number(v.price);
      const discount = v.discount === "" || v.discount == null ? 0 : Number(v.discount);
      const stock = Number(v.stock);

      if (!Number.isFinite(quantity) || quantity <= 0) return bad(`${row}: enter a size greater than 0`);
      if (!(UNITS as readonly string[]).includes(unit)) return bad(`${row}: choose a unit`);
      if (!Number.isFinite(mrp) || mrp <= 0) return bad(`${row}: enter a price greater than 0`);
      if (!Number.isFinite(discount) || discount < 0 || discount > 100) return bad(`${row}: discount must be 0–100`);
      if (!Number.isInteger(stock) || stock < 0) return bad(`${row}: stock must be a whole number (0 or more)`);

      const label = `${formatQty(quantity)} ${unit}`;
      if (seen.has(label)) return bad(`${row}: "${label}" is listed twice`);
      seen.add(label);

      const file = form.get(`variantImage_${i}`);
      if (file != null && file !== "") {
        const err = checkImage(file, `${row} image`);
        if (err) return bad(err);
      }

      const price = discount > 0 ? round2(mrp * (1 - discount / 100)) : mrp;
      parsed.push({
        label,
        quantity,
        unit,
        price,
        originalPrice: discount > 0 ? mrp : undefined,
        discount,
        stock,
        file: file instanceof File && file.size > 0 ? file : undefined,
      });
    }

    /* ── uploads (in parallel) ── */
    const [mainUrl, ...variantUrls] = await Promise.all([
      uploadOnCloudinary(image as File),
      ...parsed.map((v) => (v.file ? uploadOnCloudinary(v.file) : Promise.resolve(null))),
    ]);
    if (!mainUrl) throw new Error("Main image upload failed");
    if (parsed.some((v, i) => v.file && !variantUrls[i])) throw new Error("A variant image failed to upload");

    const variants: IVariant[] = parsed.map(({ file, ...v }, i) => ({ ...v, ...(variantUrls[i] ? { image: variantUrls[i] as string } : {}) }));
    const def = variants[0];

    const grocery = await Grocery.create({
      name,
      category,
      description: description || undefined,
      image: mainUrl,
      images: [mainUrl, ...variants.map((v) => v.image).filter(Boolean)] as string[],
      variants,
      // top-level fields mirror the default (first) variant so older pages keep working
      unit: def.unit,
      price: def.price,
      originalPrice: def.originalPrice ?? null,
      discount: def.discount ?? 0,
      stock: variants.reduce((s, v) => s + (v.stock ?? 0), 0),
    });

    return NextResponse.json({ message: "Product added successfully", data: grocery }, { status: 201 });
  } catch (error: any) {
    console.error("Add grocery error:", error);
    return NextResponse.json({ message: error?.message || "Server Error" }, { status: 500 });
  }
}

function bad(message: string) {
  return NextResponse.json({ message }, { status: 400 });
}

function checkImage(file: unknown, label: string): string | null {
  if (!(file instanceof File) || file.size === 0) return `${label} is required`;
  if (!file.type.startsWith("image/")) return `${label} must be an image`;
  if (file.size > MAX_IMAGE_BYTES) return `${label} must be under 10 MB`;
  return null;
}

const round2 = (n: number) => Math.round(n * 100) / 100;
const formatQty = (n: number) => (Number.isInteger(n) ? String(n) : String(round2(n)));
