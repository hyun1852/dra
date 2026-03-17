const partsData = [
    // --- [시트 시스템] ---
    // 1. FR SEAT
    { domain: "시트/칵핏", system: "시트", modularSystem: "FR SEAT", part: "Seat Frame", spec: "Standard", moldCost: 50, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "FR SEAT", part: "Seat Frame", spec: "Standard", moldCost: 50, targetVehicle: "NV1", sharedVehicle: "NE2" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "FR SEAT", part: "Seat Frame", spec: "Standard", moldCost: 50, targetVehicle: "JK2", sharedVehicle: "" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "FR SEAT", part: "Seat Frame", spec: "Light-Weight", moldCost: 65, targetVehicle: "ME2", sharedVehicle: "" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "FR SEAT", part: "Cushion Foam", spec: "Memory Foam", moldCost: 15, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "FR SEAT", part: "Slide Rail", spec: "Electric", moldCost: 25, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "FR SEAT", part: "Headrest", spec: "Active-Type", moldCost: 18, targetVehicle: "NE2", sharedVehicle: "" },

    // 2. RR SEAT
    { domain: "시트/칵핏", system: "시트", modularSystem: "RR SEAT", part: "Rear Frame", spec: "6:4 Foldable", moldCost: 80, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "RR SEAT", part: "Rear Frame", spec: "6:4 Foldable", moldCost: 80, targetVehicle: "NV1", sharedVehicle: "NE2" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "RR SEAT", part: "Rear Frame", spec: "6:4 Foldable", moldCost: 80, targetVehicle: "JK2", sharedVehicle: "" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "RR SEAT", part: "Center Armrest", spec: "Integrated", moldCost: 30, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "RR SEAT", part: "ISOFIX Bracket", spec: "Steel", moldCost: 10, targetVehicle: "NE2", sharedVehicle: "" },

    // --- [칵핏 시스템] ---
    // 3. IP MODULE
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "IP MODULE", part: "Main IP Panel", spec: "Soft-Pad", moldCost: 120, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "IP MODULE", part: "Main IP Panel", spec: "Soft-Pad", moldCost: 120, targetVehicle: "NV1", sharedVehicle: "NE2" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "IP MODULE", part: "Glove Box", spec: "Damping-Type", moldCost: 40, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "IP MODULE", part: "Air Vent", spec: "Slim-Design", moldCost: 35, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "IP MODULE", part: "Cluster Housing", spec: "12.3-inch", moldCost: 45, targetVehicle: "NE2", sharedVehicle: "" },

    // 4. CONSOLE
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "CONSOLE", part: "Console Body", spec: "Sliding-Type", moldCost: 95, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "CONSOLE", part: "Shift Bezel", spec: "Piano Black", moldCost: 15, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "CONSOLE", part: "Shift Bezel", spec: "Piano Black", moldCost: 15, targetVehicle: "NV1", sharedVehicle: "NE2" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "CONSOLE", part: "Cup Holder", spec: "Open-Type", moldCost: 12, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "CONSOLE", part: "Armrest Cover", spec: "Leather", moldCost: 22, targetVehicle: "NE2", sharedVehicle: "" },

    // 5. DOOR TRIM
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "DOOR TRIM", part: "Main Panel", spec: "Recycled-PET", moldCost: 100, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "DOOR TRIM", part: "Main Panel", spec: "Recycled-PET", moldCost: 100, targetVehicle: "NV1", sharedVehicle: "NE2" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "DOOR TRIM", part: "Armrest Support", spec: "Reinforced", moldCost: 35, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "DOOR TRIM", part: "Switch Bezel", spec: "Silver-Paint", moldCost: 20, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "DOOR TRIM", part: "Speaker Grille", spec: "Metal-Etching", moldCost: 38, targetVehicle: "NE2", sharedVehicle: "" },

    // --- [전장/편의 - 램프 시스템] ---
    // 6. HEAD LAMP
    { domain: "전장/편의", system: "램프", modularSystem: "HEAD LAMP", part: "LED Module", spec: "Matrix LED", moldCost: 200, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "전장/편의", system: "램프", modularSystem: "HEAD LAMP", part: "LED Module", spec: "Matrix LED", moldCost: 200, targetVehicle: "NV1", sharedVehicle: "NE2" },
    { domain: "전장/편의", system: "램프", modularSystem: "HEAD LAMP", part: "LED Module", spec: "Basic LED", moldCost: 150, targetVehicle: "JK2", sharedVehicle: "" },
    { domain: "전장/편의", system: "램프", modularSystem: "HEAD LAMP", part: "Housing", spec: "Light-Weight", moldCost: 80, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "전장/편의", system: "램프", modularSystem: "HEAD LAMP", part: "Lens", spec: "Clear Type", moldCost: 60, targetVehicle: "NE2", sharedVehicle: "" },

    // 7. REAR COMBINATION LAMP
    { domain: "전장/편의", system: "램프", modularSystem: "REAR COMB LAMP", part: "Outer Lens", spec: "Full Red", moldCost: 90, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "전장/편의", system: "램프", modularSystem: "REAR COMB LAMP", part: "Outer Lens", spec: "Full Red", moldCost: 90, targetVehicle: "NV1", sharedVehicle: "NE2" },
    { domain: "전장/편의", system: "램프", modularSystem: "REAR COMB LAMP", part: "Inner Lens", spec: "Diffusion", moldCost: 55, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "전장/편의", system: "램프", modularSystem: "REAR COMB LAMP", part: "PCB Ass'y", spec: "Multi-Function", moldCost: 110, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "전장/편의", system: "램프", modularSystem: "REAR COMB LAMP", part: "Housing", spec: "Standard", moldCost: 70, targetVehicle: "NE2", sharedVehicle: "" },

    // 8. INTERIOR LAMP
    { domain: "전장/편의", system: "램프", modularSystem: "INTERIOR LAMP", part: "Mood Light LED", spec: "RGB Color", moldCost: 45, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "전장/편의", system: "램프", modularSystem: "INTERIOR LAMP", part: "Mood Light LED", spec: "Single White", moldCost: 25, targetVehicle: "JK2", sharedVehicle: "" },
    { domain: "전장/편의", system: "램프", modularSystem: "INTERIOR LAMP", part: "Door Spot Lamp", spec: "Logo Projection", moldCost: 35, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "전장/편의", system: "램프", modularSystem: "INTERIOR LAMP", part: "Room Lamp", spec: "Touch Sensor", moldCost: 50, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "전장/편의", system: "램프", modularSystem: "INTERIOR LAMP", part: "Roof Light", spec: "LED Strip", moldCost: 40, targetVehicle: "NE2", sharedVehicle: "" },

    // 9. SIDE MIRROR
    { domain: "전장/편의", system: "램프", modularSystem: "SIDE MIRROR", part: "Mirror Glass", spec: "ECM Type", moldCost: 40, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "전장/편의", system: "램프", modularSystem: "SIDE MIRROR", part: "Actuator", spec: "Power Fold", moldCost: 85, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "전장/편의", system: "램프", modularSystem: "SIDE MIRROR", part: "Side Repeater", spec: "Sequential", moldCost: 55, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "전장/편의", system: "램프", modularSystem: "SIDE MIRROR", part: "Main Body", spec: "Standard", moldCost: 95, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "전장/편의", system: "램프", modularSystem: "SIDE MIRROR", part: "Base Plate", spec: "Reinforced", moldCost: 40, targetVehicle: "NE2", sharedVehicle: "" },

    // 10. FOG LAMP
    { domain: "전장/편의", system: "램프", modularSystem: "FOG LAMP", part: "Projection Lens", spec: "Wide View", moldCost: 50, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "전장/편의", system: "램프", modularSystem: "FOG LAMP", part: "LED Unit", spec: "Vertical Type", moldCost: 65, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "전장/편의", system: "램프", modularSystem: "FOG LAMP", part: "LED Unit", spec: "Horizontal Type", moldCost: 60, targetVehicle: "JK2", sharedVehicle: "" },
    { domain: "전장/편의", system: "램프", modularSystem: "FOG LAMP", part: "Bracket", spec: "Standard", moldCost: 20, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "전장/편의", system: "램프", modularSystem: "FOG LAMP", part: "Bezel", spec: "Black High-Gloss", moldCost: 30, targetVehicle: "NE2", sharedVehicle: "" }
];

export default partsData;
