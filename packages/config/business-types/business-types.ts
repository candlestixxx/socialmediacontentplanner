export const businessTypes = {
  real_estate: {
    label: "Real Estate",
    stats: [
      { l: 'AI Generations', v: 124 },
      { l: 'MLS Synced', v: 42 },
      { l: 'Reports', v: 12 },
      { l: 'Reach', v: '85k' }
    ],
    tools: [
      { title: "Property Listing (MLS Sync)", icon: "Database", type: "listing" },
      { title: "AI Twin Post", icon: "Users", type: "social" },
      { title: "Social Market Report", icon: "FileText", type: "report" }
    ],
    tips: [
      "Click a day on the calendar to schedule content.",
      "Use 'Create AI Twin Post' for personalized engagement.",
      "MLS Sync is active for Beverly Hills region."
    ]
  },
  ecommerce: {
    label: "E-Commerce",
    stats: [
      { l: 'Product Posts', v: 342 },
      { l: 'Catalog Synced', v: 156 },
      { l: 'Promos', v: 24 },
      { l: 'Reach', v: '120k' }
    ],
    tools: [
      { title: "Product Highlight", icon: "Database", type: "listing" },
      { title: "Influencer Collab Post", icon: "Users", type: "social" },
      { title: "Sales Promotion", icon: "FileText", type: "report" }
    ],
    tips: [
      "Schedule promotional posts ahead of major holidays.",
      "Highlight top-selling products using the 'Product Highlight' tool.",
      "Keep your catalog sync updated for accurate inventory levels."
    ]
  },
  restaurant: {
    label: "Restaurant & Food",
    stats: [
      { l: 'Menu Items', v: 85 },
      { l: 'Specials', v: 14 },
      { l: 'Events', v: 5 },
      { l: 'Reach', v: '45k' }
    ],
    tools: [
      { title: "Daily Special Post", icon: "Database", type: "listing" },
      { title: "Chef Spotlight", icon: "Users", type: "social" },
      { title: "Event Announcement", icon: "FileText", type: "report" }
    ],
    tips: [
      "Post daily specials before the lunch rush.",
      "Share behind-the-scenes content with 'Chef Spotlight'.",
      "Announce upcoming events to boost reservations."
    ]
  },
  general: {
    label: "General Business",
    stats: [
      { l: 'Posts Generated', v: 210 },
      { l: 'Campaigns', v: 8 },
      { l: 'Updates', v: 34 },
      { l: 'Reach', v: '60k' }
    ],
    tools: [
      { title: "Service Announcement", icon: "Database", type: "listing" },
      { title: "Team Highlight", icon: "Users", type: "social" },
      { title: "Industry News", icon: "FileText", type: "report" }
    ],
    tips: [
      "Maintain a consistent posting schedule.",
      "Introduce your team to build trust with your audience.",
      "Share industry news to establish authority."
    ]
  }
};

export type BusinessTypeKey = keyof typeof businessTypes;