import { Zap, Settings, Mail, Download } from "lucide-react";
import { Card } from "@/components/shared/card";

const features = [
  {
    icon: Zap,
    title: "Instant Setup",
    description:
      "Get your form endpoint in seconds. Copy, paste, and start collecting submissions immediately.",
  },
  {
    icon: Settings,
    title: "Form Control",
    description:
      "Take full control of your forms. Enable or disable submissions instantly from your dashboard.",
  },
  {
    icon: Mail,
    title: "Email Notifications",
    description:
      "Receive real-time email alerts whenever someone submits your form. Never miss a lead.",
  },
  {
    icon: Download,
    title: "Data Export",
    description:
      "Export your submissions to CSV or JSON format for easy analysis and backup.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <div className="w-fit mx-auto bg-emerald-100 text-xs text-emerald-600 tracking-wide mb-3 px-3 py-1 rounded-full flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 inline-block animate-pulse"></span>
            Powerful Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to handle forms
          </h2>
          <p className="text-lg text-gray-600">
            Built for developers who want to focus on building great frontends,
            not managing backends.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Card key={index} icon={feature.icon} className="h-full">
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h4>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
