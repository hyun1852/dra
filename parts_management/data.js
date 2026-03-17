const partsData = [
    // --- FR SEAT (단가: 50) ---
    { domain: "시트/칵핏", system: "시트", modularSystem: "FR SEAT", part: "Seat Frame", spec: "Standard", moldCost: 50, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "FR SEAT", part: "Seat Frame", spec: "Standard", moldCost: 50, targetVehicle: "NV1", sharedVehicle: "NE2" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "FR SEAT", part: "Seat Frame", spec: "Standard", moldCost: 50, targetVehicle: "JK2", sharedVehicle: "" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "FR SEAT", part: "Seat Frame", spec: "Standard", moldCost: 50, targetVehicle: "JW2", sharedVehicle: "JK2" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "FR SEAT", part: "Seat Frame", spec: "Standard", moldCost: 50, targetVehicle: "ME2", sharedVehicle: "NE2" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "FR SEAT", part: "Seat Frame", spec: "Standard", moldCost: 50, targetVehicle: "MV2", sharedVehicle: "NE2" },

    // --- RR SEAT (단가: 80) ---
    { domain: "시트/칵핏", system: "시트", modularSystem: "RR SEAT", part: "Rear Frame", spec: "6:4 Foldable", moldCost: 80, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "RR SEAT", part: "Rear Frame", spec: "6:4 Foldable", moldCost: 80, targetVehicle: "NV1", sharedVehicle: "NE2" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "RR SEAT", part: "Rear Frame", spec: "6:4 Foldable", moldCost: 80, targetVehicle: "JK2", sharedVehicle: "" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "RR SEAT", part: "Rear Frame", spec: "6:4 Foldable", moldCost: 80, targetVehicle: "ME2", sharedVehicle: "NE2" },

    // --- IP MODULE (단가: 120) ---
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "IP MODULE", part: "Main IP Panel", spec: "Soft-Pad", moldCost: 120, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "IP MODULE", part: "Main IP Panel", spec: "Soft-Pad", moldCost: 120, targetVehicle: "NV1", sharedVehicle: "NE2" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "IP MODULE", part: "Main IP Panel", spec: "Soft-Pad", moldCost: 120, targetVehicle: "JK2", sharedVehicle: "" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "IP MODULE", part: "Main IP Panel", spec: "Soft-Pad", moldCost: 120, targetVehicle: "JW2", sharedVehicle: "JK2" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "IP MODULE", part: "Main IP Panel", spec: "Soft-Pad", moldCost: 120, targetVehicle: "MV2", sharedVehicle: "" },

    // --- CONSOLE (단가: 15) ---
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "CONSOLE", part: "Shift Bezel", spec: "Piano Black", moldCost: 15, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "CONSOLE", part: "Shift Bezel", spec: "Piano Black", moldCost: 15, targetVehicle: "NV1", sharedVehicle: "NE2" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "CONSOLE", part: "Shift Bezel", spec: "Piano Black", moldCost: 15, targetVehicle: "ME2", sharedVehicle: "NE2" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "CONSOLE", part: "Shift Bezel", spec: "Piano Black", moldCost: 15, targetVehicle: "MV2", sharedVehicle: "" },

    // --- DOOR TRIM (단가: 100) ---
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "DOOR TRIM", part: "Main Panel", spec: "Recycled-PET", moldCost: 100, targetVehicle: "NE2", sharedVehicle: "" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "DOOR TRIM", part: "Main Panel", spec: "Recycled-PET", moldCost: 100, targetVehicle: "NV1", sharedVehicle: "NE2" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "DOOR TRIM", part: "Main Panel", spec: "Recycled-PET", moldCost: 100, targetVehicle: "JK2", sharedVehicle: "NE2" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "DOOR TRIM", part: "Main Panel", spec: "Recycled-PET", moldCost: 100, targetVehicle: "JW2", sharedVehicle: "NE2" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "DOOR TRIM", part: "Main Panel", spec: "Recycled-PET", moldCost: 100, targetVehicle: "ME2", sharedVehicle: "NE2" },
    { domain: "시트/칵핏", system: "칵핏", modularSystem: "DOOR TRIM", part: "Main Panel", spec: "Recycled-PET", moldCost: 100, targetVehicle: "MV2", sharedVehicle: "NE2" }
];

export default partsData;
