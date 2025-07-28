import { SiteUrlConfigurator } from "@/components/site-url-configurator"

export default function ConfigurePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Configuration Setup</h1>
          <p className="text-gray-600 mt-2">Configure your site URL and other settings</p>
        </div>
        <SiteUrlConfigurator />
      </div>
    </div>
  )
}
