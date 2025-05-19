import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

interface ServiceCardProps {
  title: string;
  icon: string;
  description: string;
  link: string;
}

export default function ServiceCard({ title, icon, description, link }: ServiceCardProps) {
  return (
    <Link to={`/services/${link.split("/").pop()}`}>
      <Card className="service-card border border-brand-bronze/20 bg-gray-50 text-gray-900 h-full shadow-lg hover:shadow-brand-bronze/10">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-brand-bronze to-brand-silver/70">
            <span className="text-white text-2xl" dangerouslySetInnerHTML={{ __html: icon }} />
          </div>
          <h3 className="text-lg font-medium mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
