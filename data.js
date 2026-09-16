/*
  RIDGE ROCK SAFETY HUB DATA
  --------------------------
  This is the main file you update when adding reports, resources,
  contacts, or toolbox talks.

  IMPORTANT:
  - Keep commas between each item.
  - Set active: false to hide an item without deleting it.
  - The highest toolbox talk number automatically becomes current.
*/

const safetyHubData = {
  lastUpdated: "September 16, 2026",

  quickLinks: [
    {
      label: "Report a Near Miss",
      target: "#reporting",
      icon: "!"
    },
    {
      label: "Current Toolbox Talk",
      target: "#toolbox",
      icon: "T"
    },
    {
      label: "SDS Library",
      target: "sds.html",
      icon: "S"
    },
    {
      label: "Safety Contacts",
      target: "#contacts",
      icon: "C"
    }
  ],

  reports: [
    {
      title: "Report a Near Miss",
      description: "Report unsafe conditions, close calls, and events that could have caused an injury or damage.",
      url: "https://forms.cloud.microsoft/r/jYkmUAKjwm",
      buttonText: "Open Near Miss Form",
      icon: "!",
      theme: "amber",
      active: true
    },
    {
      title: "Report an Incident",
      description: "Use this area for injuries, property damage, vehicle incidents, or other reportable events.",
      url: "#",
      buttonText: "Form Coming Soon",
      icon: "+",
      theme: "red",
      active: true,
      disabled: true
    },
    {
      title: "Report a Safety Concern",
      description: "Submit a general safety concern, unsafe condition, or recommendation for improvement.",
      url: "#",
      buttonText: "Form Coming Soon",
      icon: "?",
      theme: "blue",
      active: true,
      disabled: true
    },
    {
      title: "Safety Supply Request",
      description: "Request PPE, safety equipment, signs, traffic control devices, or other safety-related items needed to perform work safely.",
      url: "#",
      buttonText: "Form Coming Soon",
      icon: "E",
      theme: "slate",
      active: true,
      disabled: true
    }
  ],

  resources: [
    {
      title: "Safety Policies",
      description: "Company safety policies, expectations, and procedures.",
      url: "#",
      buttonText: "Coming Soon",
      icon: "P",
      theme: "purple",
      active: true,
      disabled: true
    },
    {
      title: "Safety Plans",
      description: "Jobsite-specific plans, emergency plans, and safety documentation.",
      url: "#",
      buttonText: "Coming Soon",
      icon: "S",
      theme: "teal",
      active: true,
      disabled: true
    },
    {
      title: "Toolbox Talk Documentation",
      description: "Document attendance and completion after discussing the weekly Toolbox Talk.",
      url: "https://forms.cloud.microsoft/r/Q3wMn0mKvE",
      buttonText: "Open Documentation Form",
      icon: "D",
      theme: "green",
      active: true
    },
    {
      title: "SDS Library",
      description: "Access Safety Data Sheets for chemicals, fuels, paving materials, concrete products, and maintenance supplies.",
      url: "sds.html",
      buttonText: "Open SDS Library",
      icon: "S",
      theme: "green",
      active: true
    }
  ],

  contacts: [
    {
      name: "Richard Payne",
      role: "Safety Officer",
      phone: "801-787-2646",
      email: "richard@ridgerockinc.com"
    },
    {
      name: "Matrix Ercanbrack",
      role: "Safety Coordinator",
      phone: "801-822-4922",
      email: "matrix@ridgerockinc.com"
    }
  ],

  toolboxTalks: [
    {
      number: 1,
      title: "Backing Safety",
      category: "Vehicle Safety",
      description: "Safe backing procedures, spotters, blind spots, and visibility.",
      fileName: "Toolbox Talk 001 - Backing Safety.pdf",
      keywords: "backing spotter blind spots vehicles visibility",
      active: true
    },
    {
      number: 2,
      title: "Slips Trips and Falls",
      category: "Fall Prevention",
      description: "Housekeeping, walking surfaces, and preventing falls.",
      fileName: "Toolbox Talk 002 - Slips Trips and Falls.pdf",
      keywords: "slips trips falls housekeeping walking surfaces",
      active: true
    },
    {
      number: 3,
      title: "Working Around Heavy Equipment",
      category: "Heavy Equipment",
      description: "Blind spots, communication, and maintaining a safe distance.",
      fileName: "Toolbox Talk 003 - Working Around Heavy Equipment.pdf",
      keywords: "heavy equipment operators blind spots communication",
      active: true
    },
    {
      number: 4,
      title: "Seat Belt Use",
      category: "Vehicle Safety",
      description: "Seat-belt requirements in company vehicles and equipment.",
      fileName: "Toolbox Talk 004 - Seat Belt Use.pdf",
      keywords: "seat belt vehicles equipment restraint",
      active: true
    },
    {
      number: 5,
      title: "Staying Hydrated",
      category: "Heat & Weather",
      description: "Preventing dehydration and heat-related illness.",
      fileName: "Toolbox Talk 005 - Staying Hydrated.pdf",
      keywords: "hydration water heat illness dehydration",
      active: true
    },
    {
      number: 6,
      title: "Trench & Excavation Safety",
      category: "Excavation",
      description: "Protective systems, safe access, and excavation hazards.",
      fileName: "Toolbox Talk 006 - Trench & Excavation Safety.pdf",
      keywords: "trench excavation cave in protective systems access",
      active: true
    },
    {
      number: 7,
      title: "Wildlife Awareness",
      category: "Environmental Safety",
      description: "Recognizing wildlife hazards and responding safely.",
      fileName: "Toolbox Talk 007 - Wildlife Awareness.pdf",
      keywords: "wildlife animals snakes hazards outdoors",
      active: true
    },
    {
      number: 8,
      title: "Hand & Finger Injury Prevention",
      category: "Injury Prevention",
      description: "Preventing pinch, crush, cut, and caught-between injuries.",
      fileName: "Toolbox Talk 008 - Hand & Finger Injury Prevention.pdf",
      keywords: "hands fingers pinch crush cuts caught between",
      active: true
    },
    {
      number: 9,
      title: "Tool and Equipment Pre-use Inspection",
      category: "Tools & Equipment",
      description: "Inspecting tools and equipment before beginning work.",
      fileName: "Toolbox Talk 009 - Tool and Equipment Pre-use Inspection.pdf",
      keywords: "tools equipment inspection defects damaged pre-use",
      active: true
    },
    {
      number: 10,
      title: "Cell Phone Use",
      category: "Distraction Awareness",
      description: "Preventing cell phone distractions while working, driving, or operating equipment.",
      fileName: "2026-08-03 Toolbox Talk 010 - Cell Phone Use.pdf",
      keywords: "cell phone phones distraction texting driving equipment focus",
      active: true
    },
    {
      number: 11,
      title: "Personal Protective Equipment",
      category: "PPE",
      description: "Required PPE, updated high-visibility safety vest requirements, and jobsite PPE compliance.",
      fileName: "2026-08-10 Toolbox Talk 011 - Personal Protective Equipment.pdf",
      keywords: "ppe personal protective equipment hard hat safety glasses high visibility safety vest reflective vest boots compliance",
      active: true
    },
    {
      number: 12,
      title: "Stop Work Authority",
      category: "General Safety",
      description: "Every employee has the authority to stop unsafe work, report hazards, and make sure conditions are corrected before work resumes.",
      fileName: "2026-08-17 Toolbox Talk 012 - Stop Work Authority.pdf",
      keywords: "stop work authority safety concern hazard speak up unsafe work supervisor foreman correct hazard resume no retaliation",
      active: true
    },
    {
      number: 13,
      title: "Fire Prevention & Dry Conditions",
      category: "Fire Prevention",
      description: "Preventing fires during hot and dry conditions, controlling ignition sources, keeping extinguishers accessible, and checking the work area before leaving.",
      fileName: "2026-08-24 Toolbox Talk 013 - Fire Prevention and Dry Conditions.pdf",
      keywords: "fire prevention dry conditions dry grass vegetation extinguisher sparks hot exhaust welding grinding cutting fire risk ignition wildfire",
      active: true
    },
    {
      number: 14,
      title: "Stricter PPE Enforcement",
      category: "PPE",
      description: "Stricter enforcement of Ridge Rock PPE requirements, employee responsibilities, and foreman accountability for crew compliance.",
      fileName: "2026-8-31 Toolbox Talk 014 - Stricter PPE Enforcement.pdf",
      keywords: "ppe enforcement personal protective equipment hard hat safety glasses high visibility reflective vest boots written warning foreman compliance",
      active: true
    },
        {
      number: 15,
      title: "Safe Trench Entry",
      category: "Excavation",
      description: "Safe trench entry requirements, competent-person inspections, access and exit, cave-in protection, and stop-work authority.",
      fileName: "2026-9-8 Toolbox Talk 015 - Safe Trench Entry.pdf",
      keywords: "trench excavation safe entry competent person cave in protection trench box shoring sloping benching ladder access exit 4 feet 5 feet stop work",
      active: true
    },
    {
      number: 16,
      title: "Utility Line Safety",
      category: "Utility Safety",
      description: "Safely locating, exposing, and identifying underground utilities before excavation and preventing utility strikes.",
      fileName: "2026-9-15 Toolbox Talk 016 - Utility Line Safety.pdf",
      keywords: "utility line safety underground utilities excavation locate expose identify markings 3 feet hand digging vacuum excavation air knife utility strike stop digging",
      active: true
    }
  ]
};
