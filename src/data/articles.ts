export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  readTime: string;
  image: string;
}

export const articles: Article[] = [
  {
    id: "art-001",
    title: "Microgrids Implementation in rural sub-saharan village",
    summary: "What my Energy Economics project taught me about microgrids in rural sub-saharan village",
    date: "April 9, 2026",
    readTime: "5 min read",
    image: "https://miro.medium.com/v2/resize:fit:4800/format:webp/1*IyoqyYW4tb4cJB_N6ppwLg.png",
    content: `
One of the projects I still think about from my master’s degree at Reykjavik University came from an Energy Economics course taught by Dr. Michael Moore. Officially, we were a group of four. In practice, though, most of the work was carried by two of us.

I handled the section on the broader case for rural electrification and microgrid deployment, while my teammate went much deeper into the financial and economic modelling side. That division made sense. He had previously worked as a researcher at S&P, so he brought a level of structure and realism to the numbers that really strengthened the project.

What made the assignment memorable was the topic itself. We were looking at microgrid applications for rural villages in Sub-Saharan Africa, in the kind of setting I strongly remember through a Ghanaian village lens, where grid extension is difficult, expensive, and often too slow to meet local needs. Even though I no longer have the full report, the surviving drafts still show the core of what we were trying to understand: how rural electrification could be approached in a way that was not only technically possible, but economically and socially durable.

At the time, I was focused on the fundamentals. What is a microgrid, and why does it matter in places like rural Sub-Saharan Africa? In our project material, a microgrid was framed as a small-scale electricity system that can run independently or alongside the main grid, combining power generation, storage, communication, control, and local demand. That mattered because many rural communities are simply too far from national infrastructure for conventional electrification to be practical in the near term.

The deeper we got into the literature, the clearer it became that electricity access is never just about electricity. Our notes linked electrification to better health outcomes, improved education through lighting for evening study, and stronger local productivity, including agriculture and small business activity. That was probably the point where the project shifted for me from being an academic exercise into something much more concrete. It stopped feeling like a technical paper and started feeling like a question about everyday life.

On the technical side, we compared several options commonly discussed for rural microgrids, including solar PV, micro-hydro, diesel, biomass, and wind. From the material that survived, the most promising pathway seemed to be a hybrid approach, especially solar PV combined with micro-hydro and battery storage. Solar made obvious sense because of the region’s strong solar resource, while storage mattered because intermittent generation only becomes useful when the system can deliver power reliably when people actually need it. The project notes also compared lead-acid and lithium-ion batteries, with the usual trade-off between lower upfront cost and better long-term performance.

What I remember most clearly, though, is that we did not romanticize the solution. The project was full of caveats, and that was probably its strongest point. Our outline kept returning to the same issues: tariff design, financial viability, policy support, technical maintenance, investor confidence, and community acceptance. The surviving summary even highlights the risk that poorly planned microgrid projects can be abandoned when investors fail to see a viable return, especially when there is weak institutional support behind the system. Other concerns were just as practical, including the lack of trained local technicians and the possibility of vandalism or dissatisfaction if the project did not align with local expectations.

That was where my team work on the financial modelling really mattered. My section gave the wider context, the development case, and the technology framing, but his contribution pushed the project into more serious territory by asking the hard questions. What would the cost structure actually look like? How would tariffs be paid? Could a rural system like this be sustainable rather than just impressive on paper? Those questions were already flagged in our project boundaries, including prepaid tariffs, LCOE comparisons, and investment risk across different technologies.

One surviving case study in our materials came from Rwamko Village in Rwanda, where a hybrid system using micro-hydro, solar PV, and battery storage reportedly electrified 200 households located about 20 km from the main grid, with an initial capital cost of USD 230,000 and annual operating cost of USD 614. Even if that was not the exact village context I personally had in mind when thinking about Ghana, it still captured the type of decentralized model we were studying: practical, hybrid, and designed for communities that large grids tend to leave behind.
    `
  },
  {
    id: "art-002",
    title: "Unlocking Indonesia's Green Finance Gap: Why Sustainability-Linked Loans Could Drive Industrial Decarbonization. ",
    summary: "A case study on how to use sustainability-linked loans to drive industrial decarbonization in Indonesia.",
    date: "March 30, 2026",
    readTime: "8 min read",
    image: "/image/ewaste1.png",
    content: `
# Introduction

Indonesia generates 1.9 million tons of e-waste annually, making it the largest e-waste producer in Southeast Asia. Yet less than 5% of that waste is formally recycled. Behind that number sits a financing problem that extends far beyond e-waste, it reflects a broader gap in how Indonesian industries access the green financing. Sustainability-Linked Loans (SLLs) are one of the most flexible and underutilized instruments available to close that gap, and Indonesia's industrial sector is only beginning to understand what they offer.

# Why SLL instead of other forms of green financing?

Unlike conventional green loans that tie funds to specific projects, SLLs work differently. They link a borrower's interest rate directly to measurable sustainability performance targets, if you meet your targets, and your cost of capital goes down but if you miss them, and it goes up. This pricing ratchet mechanism, as established by the Loan Market Association's Sustainability Linked Loan Principles, creates a continuous financial incentive for companies to improve their environmental performance across the entire business, not just in ring-fenced project activities. For Indonesia's industrial players, many of whom are beginning to face pressure from international supply chains and domestic regulators alike, this structure is particularly well-suited to the current moment.

# The Indonesian Regulatory Framework

Indonesia's regulatory environment is more ready for SLLs than most stakeholders realise. The Financial Services Authority (OJK) has been progressively building its sustainable finance ecosystem since 2015, and OJK Regulation No. 51/POJK.03/2017 already mandates that financial institutions incorporate ESG aspects into their financing activities. More recently, the release of Indonesia's Taxonomy for Sustainable Finance (TKBI) in 2024 which has updated to Version 2 in February 2025 provides a formal classification system for sustainable economic activities, including e-waste management and recycling. This taxonomy creates the definitional clarity that lenders and borrowers both need to structure SLL agreements with confidence. The framework exists. What's missing is adoption.

# The Challanges

The industrial decarbonization challenge in Indonesia is significant. Achieving the country's Enhanced Nationally Determined Contributions (ENDC) commitments and JETP targets will require an estimated USD 148-263 billion in financing. The power sector has attracted much of the attention, but the industrial sector including manufacturing, materials processing, and waste management remains underfunded in the transition conversation. SLLs offer a pathway to bring private capital into this space without requiring new public expenditure, precisely because they work through existing lending relationships between companies and commercial banks.

Take the circular economy as a concrete case. An e-waste recycling organisation seeking to scale its operations could structure an SLL around three material KPIs: electronic waste recycling rate, material recovery rate, and certified recycler engagement. If the organisation commits to progressively increasing its recycling rate, for example from 10% to 20% over three years against Indonesia's current national baseline of approximately 5% and meets those targets through independently verified annual reporting, it accesses cheaper financing. The organisation's sustainability improvement is rewarded in real financial terms, not just in reputational ones. This is the practical mechanism through which green finance stops being a compliance exercise and starts being a genuine business incentive.

The barriers to broader SLL adoption in Indonesia are real but addressable. Many companies, particularly mid-sized industrial players, lack the baseline data and governance infrastructure needed to set credible Sustainability Performance Targets and meet third-party verification requirements. Capacity building support from research and advocacy organisations helping companies understand what credible KPIs look like, how to align with OJK and LMA frameworks simultaneously, and how to engage lenders on SLL structuring would meaningfully lower the entry cost for first-time borrowers. This is where policy research institutions have a direct role to play, not just in analysing what needs to change, but in translating that analysis into tools and guidance that industrial actors can actually use.

# Conclusion

Indonesia's green finance architecture is more developed than its utilisation suggests. The OJK frameworks are in place. The taxonomy is published. International lenders like HSBC Indonesia have already begun deploying green loan facilities to circular economy businesses in the country. The building blocks already exists, what the industrial sector now needs is a clearer understanding of how to use them and a policy environment that actively encourages first movers to demonstrate what SLL adoption looks like in practice.

Sustainability-Linked Loans are not a silver bullet for industrial decarbonization. But used strategically, they represent one of the few financing mechanisms currently available that aligns private capital incentives directly with national sustainability commitments. For Indonesia to meet its climate targets, green finance cannot remain the domain of large corporations with dedicated ESG teams. It needs to reach the industrial mainstream  	and SLLs, properly supported by policy clarity and capacity building, are one credible way to get there.

    `
  },
  {
    id: "art-003",
    title: "Investigation of modeling permeable aquifers at the contact zones of basaltic lava flows",
    summary: "Masters thesis on how the undulating structure of basaltic lava flows in Reykjanes Peninsula reacted to isothermal injection",
    date: "June 22, 2024",
    readTime: "5 min read",
    image: "/image/islands.png",
    content: `
# Introduction

My thesis investigates how permeable aquifers that sit at the contact between basaltic lava flows behave when used for fluid injection or production. These contact zones are often the most permeable intervals in wells and are typically not flat but have a hummocky, undulating geometry, which is suspected to influence pressure response and flow paths in geothermal reservoirs. To explore this, I focused on synthetic representations of basalt-hosted aquifers inspired by field conditions in Iceland

# Methodology
I started by reviewing basaltic outcrops and geothermal context on the Reykjanes Peninsula in southwest Iceland and designed numerical experiments around those geological insights. The workflow used the AUTOUGH2 reservoir simulator together with PyTOUGH and TIM to build a sequence of models: a 1D radial model, a 2D rectangular model, and several 3D models that include both porous-media and MINC (dual-porosity) representations. Each model simulates injection from a central well into a permeable layer bounded by less permeable rock, and the results are checked using pressure transient analysis and comparison against Theis analytical solutions to ensure the models behave realistically.

# Results
The 2D rectangular model successfully reproduces the pressure behavior of the radial model, which gives confidence that the workflow and assumptions are reasonable before moving to 3D. In 3D, I represented the permeable aquifer as a grid of “mountains and valleys,” systematically varying the amplitude and wavelength of the undulating contact zone between basalt flows. These experiments show that aquifer geometry does affect injection behavior: cases with higher amplitude and shorter wavelength generally lead to lower injection pressures, although this is partly linked to a larger overall volume of permeable rock in those configurations. The models also reveal that geometry controls the direction and distribution of mass flow away from the well, which could matter for how pressure and temperature fronts propagate in real reservoirs.

# Summary
Overall, this work develops a practical modelling workflow and set of scripts that make it easier to construct, run, and visualize complex AUTOUGH2 models for basalt-hosted aquifers. The initial suite of radial, 2D, and 3D simulations demonstrates that the geometry of permeable layers at lava-flow contacts is not just a geometric detail but can measurably influence injection pressure and flow patterns. While the models are still simplified, they provide a structured starting point for more realistic studies of common permeable zones in basaltic geothermal systems.

# Future potential work
Future work can build on this by running a dedicated field campaign to map fresh basaltic surfaces using drones and then using those high-resolution surfaces directly in the numerical models, for example through Leapfrog Geothermal and TIM. The numerical models themselves could be refined with a finer and better-balanced grid, particularly in the vertical direction, to reduce boundary effects and better capture subtle geometric features of the aquifer. There is also an opportunity to extend the framework beyond pure water injection, for instance by introducing salt-water and geochemical interactions so it can be applied to problems like carbon capture and storage in basalt-hosted reservoirs

`
  }
];
