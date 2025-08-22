"use client";
import { Handshake, Users } from "lucide-react";
import Image from "next/image";

interface Partner {
  name: string;
  logo: string;
  description: string;
  category: string;
}

interface PartnersListProps {
  partners?: Partner[];
}

// Hard-coded partners data
const hardCodedPartners: Partner[] = [
  // Founding Partners
  {
    name: "Meta",
    logo: "/partner-meta.svg",
    description: "Social technology company",
    category: "Founding Partners",
  },
  {
    name: "Google",
    logo: "/partner-google.svg",
    description: "Technology and AI solutions",
    category: "Founding Partners",
  },
  {
    name: "La Porte",
    logo: "/partner-laporte.svg",
    description: "Investment and consulting",
    category: "Founding Partners",
  },
  {
    name: "LVMH",
    logo: "/partner-lvmh.svg",
    description: "Luxury goods conglomerate",
    category: "Founding Partners",
  },
  {
    name: "Orange",
    logo: "/partner-orange.svg",
    description: "Telecommunications services",
    category: "Founding Partners",
  },
  {
    name: "Criteo",
    logo: "/partner-criteo.svg",
    description: "Digital advertising platform",
    category: "Country of the Year",
  },

  // Platinum Partners
  {
    name: "G42",
    logo: "/partner-g42.svg",
    description: "AI and cloud computing",
    category: "Platinum Partners",
  },
  {
    name: "AWS",
    logo: "/partner-aws.svg",
    description: "Amazon Web Services",
    category: "Platinum Partners",
  },
  {
    name: "Aramco",
    logo: "/partner-aramco.svg",
    description: "Energy and petrochemicals",
    category: "Platinum Partners",
  },
  {
    name: "Dubai",
    logo: "/partner-dubai.svg",
    description: "Government of Dubai",
    category: "Platinum Partners",
  },
  {
    name: "Microsoft",
    logo: "/partner-microsoft.svg",
    description: "Cloud and productivity solutions",
    category: "Platinum Partners",
  },
  {
    name: "NVIDIA GTC",
    logo: "/partner-nvidia.svg",
    description: "GPU and AI computing",
    category: "Platinum Partners",
  },
  {
    name: "PwC",
    logo: "/partner-pwc.svg",
    description: "Professional services",
    category: "Platinum Partners",
  },

  // Gold Partners
  {
    name: "UNESCO",
    logo: "/partner-unesco.svg",
    description: "United Nations Educational",
    category: "Gold Partners",
  },
  {
    name: "Viva Tech",
    logo: "/partner-vivatech.svg",
    description: "Technology conference",
    category: "Gold Partners",
  },
  {
    name: "AXA",
    logo: "/partner-axa.svg",
    description: "Insurance and asset management",
    category: "Gold Partners",
  },
  {
    name: "GHNA",
    logo: "/partner-ghna.svg",
    description: "Health and nutrition alliance",
    category: "Gold Partners",
  },
  {
    name: "DocuSign",
    logo: "/partner-docusign.svg",
    description: "Digital signature platform",
    category: "Gold Partners",
  },
  {
    name: "EDF",
    logo: "/partner-edf.svg",
    description: "Energy services",
    category: "Gold Partners",
  },
  {
    name: "Ericsson",
    logo: "/partner-ericsson.svg",
    description: "Telecommunications equipment",
    category: "Gold Partners",
  },

  // Silver Partners
  {
    name: "Adobe",
    logo: "/partner-adobe.svg",
    description: "Digital media and marketing",
    category: "Silver Partners",
  },
  {
    name: "Hyland",
    logo: "/partner-hyland.svg",
    description: "Content services platform",
    category: "Silver Partners",
  },
  {
    name: "Nexthink",
    logo: "/partner-nexthink.svg",
    description: "Digital employee experience",
    category: "Silver Partners",
  },
  {
    name: "Capgemini",
    logo: "/partner-capgemini.svg",
    description: "Technology consulting",
    category: "Silver Partners",
  },
  {
    name: "CNA CRM",
    logo: "/partner-cnacrm.svg",
    description: "Customer relationship management",
    category: "Silver Partners",
  },
  {
    name: "OTB",
    logo: "/partner-otb.svg",
    description: "Fashion and luxury group",
    category: "Silver Partners",
  },

  // Co-Organizers
  {
    name: "Forbes",
    logo: "/partner-forbes.svg",
    description: "Business media platform",
    category: "Co-Organizers",
  },
  {
    name: "Reuters",
    logo: "/partner-reuters.svg",
    description: "International news organization",
    category: "Co-Organizers",
  },
];

// Simple Partner Category Display Component
function PartnerCategoryDisplay({
  categoryPartners,
  categoryName,
}: {
  categoryPartners: Partner[];
  categoryName: string;
}) {
  if (categoryPartners.length === 0) return null;

  const getCategoryColor = (category: string) => {
    const colors = {
      "Founding Partners": "text-blue-400 border-blue-400/20",
      "Country of the Year": "text-emerald-400 border-emerald-400/20",
      "Platinum Partners": "text-slate-400 border-slate-400/20",
      "Gold Partners": "text-yellow-400 border-yellow-400/20",
      "Silver Partners": "text-gray-400 border-gray-400/20",
      "Co-Organizers": "text-purple-400 border-purple-400/20",
      "Project Partners": "text-indigo-400 border-indigo-400/20",
    };
    return (
      colors[category as keyof typeof colors] || colors["Project Partners"]
    );
  };

  const colorClass = getCategoryColor(categoryName);

  return (
    <div className="mb-12">
      {/* Category Header */}
      <div className="flex items-center gap-4 mb-6">
        <h3 className={`text-xl font-semibold ${colorClass.split(" ")[0]}`}>
          {categoryName}
        </h3>
        <div className={`px-3 py-1 ${colorClass} border rounded-full`}>
          <span className="text-xs font-medium">
            {categoryPartners.length} đối tác
          </span>
        </div>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categoryPartners.map((partner) => (
          <div key={partner.name} className="group">
            <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 h-24 flex items-center justify-center">
              <div className="relative w-full h-full">
                {/* Try to load real logo first, fallback to text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={60}
                    height={40}
                    className="max-w-full max-h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                    onError={(e) => {
                      // Hide image on error and show text fallback
                      e.currentTarget.style.display = "none";
                      const textFallback = e.currentTarget
                        .nextSibling as HTMLElement;
                      if (textFallback) {
                        textFallback.style.display = "flex";
                      }
                    }}
                  />
                  {/* Text fallback */}
                  <div
                    className="hidden items-center justify-center w-full h-full text-gray-600 text-sm font-medium text-center leading-tight"
                    style={{ display: "none" }}
                  >
                    {partner.name}
                  </div>
                </div>
              </div>

              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                {partner.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PartnersList({ partners = [] }: PartnersListProps) {
  const allPartners = partners.length > 0 ? partners : hardCodedPartners;

  // Group partners by category
  const partnersByCategory = allPartners.reduce((acc, partner) => {
    if (!acc[partner.category]) {
      acc[partner.category] = [];
    }
    acc[partner.category].push(partner);
    return acc;
  }, {} as Record<string, Partner[]>);

  // Define category order
  const categoryOrder = [
    "Project Partners",
    "Founding Partners",
    "Platinum Partners",
    "Gold Partners",
    "Silver Partners",
    "Co-Organizers",
    "Country of the Year",
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6">
        {allPartners.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Handshake className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500">Chưa có đối tác nào được thêm vào</p>
          </div>
        ) : (
          <div className="space-y-8">
            {categoryOrder.map((category) => {
              const categoryPartners = partnersByCategory[category];
              if (!categoryPartners || categoryPartners.length === 0)
                return null;

              return (
                <PartnerCategoryDisplay
                  key={category}
                  categoryPartners={categoryPartners}
                  categoryName={category}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
