export default function Home() {
  return (
    <div className="min-h-screen bg-surface selection:bg-primary-container/30">
      {/* Intentional Asymmetry Layout */}
      <main className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        
        {/* Sidebar (Secondary Tooling) */}
        <aside className="lg:col-span-3 bg-surface-dim p-8 pt-16 flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full" />
            <span className="text-label-md uppercase tracking-widest">Architect</span>
          </div>
          
          <nav className="flex flex-col gap-4 mt-12">
            <button className="text-left text-title-md text-on-surface hover:text-primary transition-colors">Dashboard</button>
            <button className="text-left text-title-md text-on-surface/60 hover:text-primary transition-colors">Transactions</button>
            <button className="text-left text-title-md text-on-surface/60 hover:text-primary transition-colors">Insights</button>
            <button className="text-left text-title-md text-on-surface/60 hover:text-primary transition-colors">Settings</button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <section className="lg:col-span-9 p-8 lg:pl-16 lg:pr-8 pt-16">
          <div className="max-w-4xl">
            {/* Editorial Scale: Display-lg vs Body-md */}
            <header className="mb-16">
              <span className="text-label-md text-primary uppercase tracking-[0.2em] mb-4 block">Current Portfolio</span>
              <h1 className="text-display-lg leading-none tracking-tight mb-6">
                Editorial <br /> Precision.
              </h1>
              <p className="text-body-md max-w-md text-on-surface/70">
                A pristine digital workspace designed for deep thought and financial clarity. 
                Experience intentional asymmetry and tonal depth.
              </p>
            </header>

            {/* Focus Pane Component */}
            <div className="focus-pane mb-12">
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-headline-sm">Activity Overview</h2>
                <div className="flex gap-4">
                  <button className="btn-secondary">Export Data</button>
                  <button className="btn-primary">Add Entry</button>
                </div>
              </div>

              {/* Tonal Layering Example: List with no dividers */}
              <div className="space-y-[0.625rem]">
                {[
                  { label: "Quarterly Review", value: "+$12,400.00", date: "MAR 12" },
                  { label: "Infrastructure Upgrade", value: "-$2,150.00", date: "MAR 10" },
                  { label: "Client Retainer", value: "+$4,800.00", date: "MAR 08" },
                ].map((item, i) => (
                  <div key={i} className="group flex items-center justify-between p-6 bg-surface-container-low hover:bg-surface-container-high transition-colors rounded-lg">
                    <div>
                      <span className="text-label-md text-on-surface/40 mb-1 block">{item.date}</span>
                      <span className="text-title-md">{item.label}</span>
                    </div>
                    <span className={`text-title-md font-bold ${item.value.startsWith('+') ? 'text-primary' : 'text-on-surface'}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Canvas Input Example */}
            <div className="max-w-md">
              <label className="text-label-md uppercase mb-2 block">Quick Note</label>
              <input 
                type="text" 
                placeholder="Type something significant..." 
                className="input-canvas"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
