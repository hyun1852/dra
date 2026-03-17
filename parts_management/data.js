const partsData = [
    // 시트 시스템 - FR SEAT
    { domain: "시트/칵핏", system: "시트", modularSystem: "FR SEAT", part: "Seat Frame", spec: "Standard", moldCost: 45, targetVehicle: "EV6", sharedVehicle: "IONIQ5" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "FR SEAT", part: "Seat Frame", spec: "Power-Adjust", moldCost: 55, targetVehicle: "EV6", sharedVehicle: "IONIQ5, GV60" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "FR SEAT", part: "Seat Frame", spec: "Light-Weight", moldCost: 65, targetVehicle: "EV6", sharedVehicle: "EV9" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "FR SEAT", part: "Cushion Foam", spec: "Memory Foam", moldCost: 12, targetVehicle: "EV6", sharedVehicle: "IONIQ5" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "FR SEAT", part: "Backrest Cover", spec: "Leather", moldCost: 8, targetVehicle: "EV6", sharedVehicle: "GV60" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "FR SEAT", part: "Slide Rail", spec: "Electric", moldCost: 22, targetVehicle: "EV6", sharedVehicle: "IONIQ5" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "FR SEAT", part: "Headrest", spec: "Active-Type", moldCost: 15, targetVehicle: "EV6", sharedVehicle: "EV9" },

    // 시트 시스템 - RR SEAT
    { domain: "시트/칵핏", system: "시트", modularSystem: "RR SEAT", part: "Rear Frame", spec: "6:4 Foldable", moldCost: 85, targetVehicle: "EV6", sharedVehicle: "IONIQ5" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "RR SEAT", part: "Cushion Pad", spec: "Standard", moldCost: 18, targetVehicle: "EV6", sharedVehicle: "IONIQ5" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "RR SEAT", part: "Center Armrest", spec: "Integrated", moldCost: 25, targetVehicle: "EV6", sharedVehicle: "GV60" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "RR SEAT", part: "ISOFIX Bracket", spec: "Steel", moldCost: 5, targetVehicle: "EV6", sharedVehicle: "IONIQ5, GV60" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "RR SEAT", part: "Heating Pad", spec: "2-Step", moldCost: 10, targetVehicle: "EV6", sharedVehicle: "IONIQ5" },

    // 칵핏 시스템 - IP MODULE
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "IP MODULE", part: "Main IP Panel", spec: "Soft-Pad", moldCost: 150, targetVehicle: "EV6", sharedVehicle: "IONIQ5" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "IP MODULE", part: "Glove Box", spec: "Damping-Type", moldCost: 35, targetVehicle: "EV6", sharedVehicle: "IONIQ5" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "IP MODULE", part: "Air Vent", spec: "Slim-Design", moldCost: 28, targetVehicle: "EV6", sharedVehicle: "EV9" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "IP MODULE", part: "Cluster Housing", spec: "12.3-inch", moldCost: 42, targetVehicle: "EV6", sharedVehicle: "IONIQ5" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "IP MODULE", part: "HUD Bracket", spec: "Reinforced", moldCost: 18, targetVehicle: "EV6", sharedVehicle: "GV60" },

    // 칵핏 시스템 - CONSOLE
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "CONSOLE", part: "Console Body", spec: "Sliding-Type", moldCost: 95, targetVehicle: "EV6", sharedVehicle: "IONIQ5" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "CONSOLE", part: "Cup Holder", spec: "Open-Type", moldCost: 12, targetVehicle: "EV6", sharedVehicle: "IONIQ5" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "CONSOLE", part: "USB Module", spec: "Type-C Fast", moldCost: 8, targetVehicle: "EV6", sharedVehicle: "EV9" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "CONSOLE", part: "Armrest Cover", spec: "Synthetic Leather", moldCost: 20, targetVehicle: "EV6", sharedVehicle: "IONIQ5" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "CONSOLE", part: "Shift Bezel", spec: "Piano Black", moldCost: 15, targetVehicle: "EV6", sharedVehicle: "GV60" },

    // 칵핏 시스템 - DOOR TRIM
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "DOOR TRIM", part: "Main Panel", spec: "Recycled-PET", moldCost: 110, targetVehicle: "EV6", sharedVehicle: "IONIQ5" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "DOOR TRIM", part: "Armrest Support", spec: "Integrated", moldCost: 30, targetVehicle: "EV6", sharedVehicle: "IONIQ5" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "DOOR TRIM", part: "Switch Bezel", spec: "Silver-Paint", moldCost: 18, targetVehicle: "EV6", sharedVehicle: "EV9" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "DOOR TRIM", part: "Map Pocket", spec: "Illuminated", moldCost: 25, targetVehicle: "EV6", sharedVehicle: "GV60" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "DOOR TRIM", part: "Speaker Grille", spec: "Metal-Etching", moldCost: 35, targetVehicle: "EV6", sharedVehicle: "IONIQ5" }
];

export default partsData;
