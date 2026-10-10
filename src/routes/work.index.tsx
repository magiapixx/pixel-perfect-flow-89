import { createFileRoute } from '@tanstack/react-router'
import { Breadcrumb, ProjectHero, ProjectGrid, FAQ, ContactBand, pageHead } from '@/components/site/site'
export const Route = createFileRoute('/work/')({head:()=>pageHead('Our Work','Explore Clay’s selected branding, digital product, and website projects.'),component:Work})
function Work() {return <main><section className="wrap page-top"><Breadcrumb current="Selected work"/><div className="page-intro"><h1>Our proudly works</h1><p>A few of our favorite collaborations, crafted with purpose. A fresh perspective on what comes next.</p></div></section><div className="wrap"><div className="-mx-6"><ProjectHero/></div><div className="mt-6"><ProjectGrid extended/></div></div><FAQ/><ContactBand/></main>}
