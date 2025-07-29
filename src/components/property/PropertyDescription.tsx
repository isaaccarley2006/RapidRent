
import React from 'react'

interface PropertyDescriptionProps {
  description: string | null
}

export const PropertyDescription: React.FC<PropertyDescriptionProps> = ({
  description
}) => {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            About this property
          </h2>
          <div className="w-12 h-0.5 bg-primary rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Overview Card */}
          <div className="group relative bg-gradient-to-br from-card via-card to-muted/20 border border-border/40 rounded-2xl shadow-lg hover:shadow-xl p-8 space-y-6 animate-fade-in transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/60 rounded-t-2xl"></div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <span className="text-primary font-bold text-lg">📍</span>
              </div>
              <h3 className="text-xl font-bold text-foreground tracking-tight">Overview</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: "Location", value: "Central London", icon: "🏙️" },
                { label: "Type", value: "Apartment", icon: "🏠" },
                { label: "Bedrooms", value: "2", icon: "🛏️" },
                { label: "Bathrooms", value: "1", icon: "🚿" },
                { label: "Furnished", value: "Yes", icon: "🪑" },
                { label: "Deposit", value: "£2,400", icon: "💰" }
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-xl border border-border/20 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground bg-background px-3 py-1 rounded-lg border">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lease Details Card */}
          <div className="group relative bg-gradient-to-br from-card via-card to-muted/20 border border-border/40 rounded-2xl shadow-lg hover:shadow-xl p-8 space-y-6 animate-fade-in transition-all duration-300 hover:scale-[1.02]" style={{ animationDelay: '150ms' }}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-400 rounded-t-2xl"></div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <span className="text-blue-500 font-bold text-lg">📋</span>
              </div>
              <h3 className="text-xl font-bold text-foreground tracking-tight">Lease Details</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: "Available From", value: "Immediately", icon: "📅" },
                { label: "Minimum Lease", value: "12 months", icon: "⏱️" },
                { label: "Bills Included", value: "Partially", icon: "💡" }
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-xl border border-border/20 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground bg-background px-3 py-1 rounded-lg border">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Features Card */}
          <div className="group relative bg-gradient-to-br from-card via-card to-muted/20 border border-border/40 rounded-2xl shadow-lg hover:shadow-xl p-8 space-y-6 animate-fade-in transition-all duration-300 hover:scale-[1.02]" style={{ animationDelay: '300ms' }}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-400 rounded-t-2xl"></div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                <span className="text-green-500 font-bold text-lg">✨</span>
              </div>
              <h3 className="text-xl font-bold text-foreground tracking-tight">Key Features</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: "Pet Friendly", value: "No", icon: "🐕" },
                { label: "Parking", value: "Street", icon: "🚗" },
                { label: "Garden", value: "Shared", icon: "🌿" },
                { label: "Balcony", value: "Yes", icon: "🌅" }
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-xl border border-border/20 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground bg-background px-3 py-1 rounded-lg border">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
