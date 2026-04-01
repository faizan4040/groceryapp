import blogBanner from "@/constants/images/blog_banner.jpg";
import grocery from "@/constants/images/grocery.jpg";


export const blogs = [
  {
    id: 1,
    slug: "data-warehouse-journey-dbt",
    title: "Data Warehouse Journey With dbt",
    category: "Technology",
    author: "Team Blinkit",
    date: "July 16, 2024",
    readTime: "6 mins read",
    image: grocery,
    excerpt:
      "The data team has grown tremendously at Blinkit in the past 12 months...",
    content: `
The data team has grown tremendously at Blinkit in the past 12 months. With increasing demands for optimization, growth, and efficiency, we needed a modern data stack that could scale seamlessly.

We adopted dbt (data build tool) to transform our data workflows. It allowed us to modularize SQL transformations, improve testing, and bring software engineering practices into analytics.

One of the biggest wins was enabling faster iteration. Analysts could now ship models independently without relying heavily on data engineers.

As we continue to grow, our data platform will remain a core pillar of decision-making across the organization.
    `,
  },

  {
    id: 2,
    slug: "first-12-months-blinkit",
    title: "First 12 Months at Blinkit: Abhishek M",
    category: "Humans of Blinkit",
    author: "Tech Team",
    date: "May 26, 2022",
    readTime: "5 mins read",
    image: grocery,
    excerpt:
      "Having started my own company prior to joining Blinkit...",
    content: `
Having started my own company prior to joining Blinkit, I had developed the ability to adapt quickly and thrive in dynamic environments.

At Blinkit, I found a team that was not only passionate but deeply focused on solving real-world problems. The idea of building technology for 10-minute delivery fascinated me.

Over the past year, I have worked on scaling backend systems, optimizing delivery pipelines, and improving reliability.

This journey has been incredibly rewarding, both professionally and personally.
    `,
  },

  {
    id: 3,
    slug: "building-10-minute-delivery",
    title: "How We Built 10-Minute Delivery Infrastructure",
    category: "Technology",
    author: "Engineering Team",
    date: "August 2, 2024",
    readTime: "7 mins read",
    image: grocery,
    excerpt:
      "Delivering groceries in 10 minutes is not magic — it's engineering...",
    content: `
Delivering groceries in 10 minutes is not magic — it's a result of careful planning, optimization, and engineering excellence.

We designed a hyperlocal warehouse system that ensures products are always close to customers. Combined with real-time routing algorithms, we minimize delivery time.

Our tech stack includes high-performance APIs, event-driven architecture, and smart inventory systems.

The biggest challenge was maintaining consistency during peak hours. We solved this with predictive demand systems.

This is just the beginning of ultra-fast commerce.
    `,
  },

  {
    id: 4,
    slug: "company-culture-growth",
    title: "Building a Culture of Growth and Ownership",
    category: "Culture",
    author: "HR Team",
    date: "June 10, 2024",
    readTime: "4 mins read",
    image: grocery,
    excerpt:
      "At Blinkit, culture is not just a buzzword...",
    content: `
At Blinkit, culture is not just a buzzword — it's something we actively build every day.

We encourage ownership at every level. Whether you're an intern or a senior leader, your ideas matter.

Transparency and collaboration are key pillars. We believe in open communication and continuous feedback.

Our goal is to create an environment where people can do their best work and grow rapidly.
    `,
  },

  {
    id: 5,
    slug: "sustainability-initiatives",
    title: "Our Sustainability Initiatives in 2024",
    category: "Sustainability",
    author: "Operations Team",
    date: "September 5, 2024",
    readTime: "5 mins read",
    image: grocery,
    excerpt:
      "Sustainability is at the core of everything we do...",
    content: `
Sustainability is at the core of everything we do at Blinkit.

In 2024, we introduced eco-friendly packaging across multiple cities. We also optimized delivery routes to reduce carbon emissions.

We are working closely with local farmers to promote sustainable sourcing practices.

Our mission is to create a greener and more responsible supply chain.
    `,
  },

  {
    id: 6,
    slug: "expansion-new-cities",
    title: "Expanding to New Cities Across India",
    category: "Newsroom",
    author: "PR Team",
    date: "October 1, 2024",
    readTime: "3 mins read",
    image: grocery,
    excerpt:
      "Blinkit is now live in 20+ new cities...",
    content: `
We are excited to announce our expansion into 20+ new cities across India.

This expansion allows us to bring fast delivery services to millions of new customers.

Our focus remains on speed, reliability, and customer satisfaction.

We are committed to building the future of quick commerce in India.
    `,
  },
];