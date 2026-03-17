const partsData = [
    // --- [기존 데이터] ---
    { domain: "시트/칵핏", system: "시트", modularSystem: "FR SEAT", part: "Seat Frame", spec: "Standard", moldCost: 50, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "FR SEAT", part: "Seat Frame", spec: "Standard", moldCost: 50, targetVehicle: "NV1", sharedVehicle: "NE2" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "FR SEAT", part: "Seat Frame", spec: "Standard", moldCost: 50, targetVehicle: "JK2", sharedVehicle: "" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "FR SEAT", part: "Seat Frame", spec: "Standard", moldCost: 50, targetVehicle: "JW2", sharedVehicle: "JK2" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "FR SEAT", part: "Seat Frame", spec: "Standard", moldCost: 50, targetVehicle: "ME2", sharedVehicle: "NE2" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "FR SEAT", part: "Seat Frame", spec: "Standard", moldCost: 50, targetVehicle: "MV2", sharedVehicle: "NE2" },

    { domain: "시트/칵핏", system: "시트", modularSystem: "RR SEAT", part: "Rear Frame", spec: "6:4 Foldable", moldCost: 80, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "RR SEAT", part: "Rear Frame", spec: "6:4 Foldable", moldCost: 80, targetVehicle: "NV1", sharedVehicle: "NE2" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "RR SEAT", part: "Rear Frame", spec: "6:4 Foldable", moldCost: 80, targetVehicle: "JK2", sharedVehicle: "" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "RR SEAT", part: "Rear Frame", spec: "6:4 Foldable", moldCost: 80, targetVehicle: "ME2", sharedVehicle: "NE2" },

    { domain: "시트/칵핏", system: "칵핏", modularSystem: "IP MODULE", part: "Main IP Panel", spec: "Soft-Pad", moldCost: 120, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "IP MODULE", part: "Main IP Panel", spec: "Soft-Pad", moldCost: 120, targetVehicle: "NV1", sharedVehicle: "NE2" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "IP MODULE", part: "Main IP Panel", spec: "Soft-Pad", moldCost: 120, targetVehicle: "JK2", sharedVehicle: "" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "IP MODULE", part: "Main IP Panel", spec: "Soft-Pad", moldCost: 120, targetVehicle: "JW2", sharedVehicle: "JK2" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "IP MODULE", part: "Main IP Panel", spec: "Soft-Pad", moldCost: 120, targetVehicle: "MV2", sharedVehicle: "" },

    { domain: "시트/칵핏", system: "칵핏", modularSystem: "CONSOLE", part: "Shift Bezel", spec: "Piano Black", moldCost: 15, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "CONSOLE", part: "Shift Bezel", spec: "Piano Black", moldCost: 15, targetVehicle: "NV1", sharedVehicle: "NE2" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "CONSOLE", part: "Shift Bezel", spec: "Piano Black", moldCost: 15, targetVehicle: "ME2", sharedVehicle: "NE2" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "CONSOLE", part: "Shift Bezel", spec: "Piano Black", moldCost: 15, targetVehicle: "MV2", sharedVehicle: "" },

    { domain: "시트/칵핏", system: "칵핏", modularSystem: "DOOR TRIM", part: "Main Panel", spec: "Recycled-PET", moldCost: 100, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "DOOR TRIM", part: "Main Panel", spec: "Recycled-PET", moldCost: 100, targetVehicle: "NV1", sharedVehicle: "NE2" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "DOOR TRIM", part: "Main Panel", spec: "Recycled-PET", moldCost: 100, targetVehicle: "JK2", sharedVehicle: "NE2" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "DOOR TRIM", part: "Main Panel", spec: "Recycled-PET", moldCost: 100, targetVehicle: "JW2", sharedVehicle: "NE2" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "DOOR TRIM", part: "Main Panel", spec: "Recycled-PET", moldCost: 100, targetVehicle: "ME2", sharedVehicle: "NE2" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "DOOR TRIM", part: "Main Panel", spec: "Recycled-PET", moldCost: 100, targetVehicle: "MV2", sharedVehicle: "NE2" },

    // --- [신규 추가: 전장/편의 - 램프 시스템] ---
    
    // 1. HEAD LAMP (Modular 1)
    { domain: "전장/편의", system: "램프", modularSystem: "HEAD LAMP", part: "LED Module", spec: "Matrix LED", moldCost: 200, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "전장/편의", system: "램프", modularSystem: "HEAD LAMP", part: "LED Module", spec: "Matrix LED", moldCost: 200, targetVehicle: "NV1", sharedVehicle: "NE2" },
    { domain: "전장/편의", system: "램프", modularSystem: "HEAD LAMP", part: "LED Module", spec: "Matrix LED", moldCost: 200, targetVehicle: "ME2", sharedVehicle: "NE2" },
    
    { domain: "전장/편의", system: "램프", modularSystem: "HEAD LAMP", part: "LED Module", spec: "Basic LED", moldCost: 150, targetVehicle: "JK2", sharedVehicle: "" },
    { domain: "전장/편의", system: "램프", modularSystem: "HEAD LAMP", part: "LED Module", spec: "Basic LED", moldCost: 150, targetVehicle: "JW2", sharedVehicle: "JK2" },
    { domain: "전장/편의", system: "램프", modularSystem: "HEAD LAMP", part: "LED Module", spec: "Basic LED", moldCost: 150, targetVehicle: "MV2", sharedVehicle: "JK2" },

    { domain: "전장/편의", system: "램프", modularSystem: "HEAD LAMP", part: "Housing", spec: "Light-Weight", moldCost: 80, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "전장/편의", system: "램프", modularSystem: "HEAD LAMP", part: "Housing", spec: "Light-Weight", moldCost: 80, targetVehicle: "NV1", sharedVehicle: "NE2" },

    { domain: "전장/편의", system: "램프", modularSystem: "HEAD LAMP", part: "Lens", spec: "Clear Type", moldCost: 60, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "전장/편의", system: "램프", modularSystem: "HEAD LAMP", part: "Lens", spec: "Tinted Type", moldCost: 65, targetVehicle: "JK2", sharedVehicle: "" },

    { domain: "전장/편의", system: "램프", modularSystem: "HEAD LAMP", part: "Bezel", spec: "Chrome", moldCost: 40, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "전장/편의", system: "램프", modularSystem: "HEAD LAMP", part: "Fan Module", spec: "Standard", moldCost: 30, targetVehicle: "NE2", sharedVehicle: "" },

    // 2. REAR COMBINATION LAMP (Modular 2)
    { domain: "전장/편의", system: "램프", modularSystem: "REAR COMB LAMP", part: "Outer Lens", spec: "Full Red", moldCost: 90, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "전장/편의", system: "램프", modularSystem: "REAR COMB LAMP", part: "Outer Lens", spec: "Full Red", moldCost: 90, targetVehicle: "NV1", sharedVehicle: "NE2" },
    
    { domain: "전장/편의", system: "램프", modularSystem: "REAR COMB LAMP", part: "Inner Lens", spec: "Diffusion", moldCost: 55, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "전장/편의", system: "램프", modularSystem: "REAR COMB LAMP", part: "PCB Ass'y", spec: "Multi-Function", moldCost: 110, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "전장/편의", system: "램프", modularSystem: "REAR COMB LAMP", part: "PCB Ass'y", spec: "Multi-Function", moldCost: 110, targetVehicle: "JK2", sharedVehicle: "" },
    
    { domain: "전장/편의", system: "램프", modularSystem: "REAR COMB LAMP", part: "Housing", spec: "Standard", moldCost: 70, targetVehicle: "NE2", sharedVehicle: "" },

    // 3. INTERIOR LAMP (Modular 3)
    { domain: "전장/편의", system: "램프", modularSystem: "INTERIOR LAMP", part: "Mood Light LED", spec: "RGB Color", moldCost: 45, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "전장/편의", system: "램프", modularSystem: "INTERIOR LAMP", part: "Mood Light LED", spec: "RGB Color", moldCost: 45, targetVehicle: "NV1", sharedVehicle: "NE2" },
    
    { domain: "전장/편의", system: "램프", modularSystem: "INTERIOR LAMP", part: "Mood Light LED", spec: "Single White", moldCost: 25, targetVehicle: "JK2", sharedVehicle: "" },
    
    { domain: "전장/편의", system: "램프", modularSystem: "INTERIOR LAMP", part: "Door Spot Lamp", spec: "Logo Projection", moldCost: 35, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "전장/편의", system: "램프", modularSystem: "INTERIOR LAMP", part: "Room Lamp", spec: "Touch Sensor", moldCost: 50, targetVehicle: "NE2", sharedVehicle: "" },

    // 4. SIDE MIRROR (Modular 4)
    { domain: "전장/편의", system: "램프", modularSystem: "SIDE MIRROR", part: "Mirror Glass", spec: "ECM Type", moldCost: 40, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "전장/편의", system: "램프", modularSystem: "SIDE MIRROR", part: "Actuator", spec: "Power Fold", moldCost: 85, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "전장/편의", system: "램프", modularSystem: "SIDE MIRROR", part: "Actuator", spec: "Manual", moldCost: 30, targetVehicle: "JK2", sharedVehicle: "" },
    
    { domain: "전장/편의", system: "램프", modularSystem: "SIDE MIRROR", part: "Side Repeater", spec: "Sequential", moldCost: 55, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "전장/편의", system: "램프", modularSystem: "SIDE MIRROR", part: "Main Body", spec: "Standard", moldCost: 95, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "전장/편의", system: "램프", modularSystem: "SIDE MIRROR", part: "Base Plate", spec: "Reinforced", moldCost: 40, targetVehicle: "NE2", sharedVehicle: "" },

    // 5. FOG LAMP (Modular 5)
    { domain: "전장/편의", system: "램프", modularSystem: "FOG LAMP", part: "Projection Lens", spec: "Wide View", moldCost: 50, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "전장/편의", system: "램프", modularSystem: "FOG LAMP", part: "LED Unit", spec: "Vertical Type", moldCost: 65, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "전장/편의", system: "램프", modularSystem: "FOG LAMP", part: "LED Unit", spec: "Horizontal Type", moldCost: 60, targetVehicle: "JK2", sharedVehicle: "" },
    { domain: "전장/편의", system: "램프", modularSystem: "FOG LAMP", part: "Bracket", spec: "Standard", moldCost: 20, targetVehicle: "NE2", sharedVehicle: "" }
];

export default partsData;
