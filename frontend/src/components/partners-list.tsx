import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Handshake } from "lucide-react";

interface Partner {
  name: string;
  logo: string;
  description: string;
}

interface PartnersListProps {
  partners: Partner[];
}

export function PartnersList({ partners }: PartnersListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Handshake className="w-5 h-5 text-emerald-600" />
          Đối tác
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/50 transition-colors"
            >
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src={partner.logo || "/placeholder.svg"}
                  alt={partner.name}
                  fill
                  className="object-contain rounded"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-slate-900 text-sm line-clamp-1">
                  {partner.name}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                  {partner.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
