const partsData = [
    // EV6
    { domain: "시트/칵핏", system: "시트", modularSystem: "FR SEAT", part: "Front Seat Frame", spec: "Leather-Type A", moldCost: 30, targetVehicle: "EV6", sharedVehicle: "IONIQ5" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "RR SEAT", part: "Rear Seat Cushion", spec: "Standard", moldCost: 45, targetVehicle: "EV6", sharedVehicle: "IONIQ5, GV60" },
    { domain: "시트/칵핏", system: "칵핏모듈", modularSystem: "IP MODULE", part: "Main Board", spec: "12.3-inch", moldCost: 120, targetVehicle: "EV6", sharedVehicle: "IONIQ5" },
    { domain: "전장", system: "AVN", modularSystem: "HEAD UNIT", part: "Display Panel", spec: "Curved Display", moldCost: 200, targetVehicle: "EV6", sharedVehicle: "EV9, IONIQ7" },
    { domain: "파워트레인", system: "인버터", modularSystem: "PCU", part: "Power Module", spec: "800V High Power", moldCost: 350, targetVehicle: "EV6", sharedVehicle: "IONIQ6, IONIQ5" },
    { domain: "바디", system: "후드", modularSystem: "FRONT BODY", part: "Hood Inner Panel", spec: "Aluminum-AL5052", moldCost: 180, targetVehicle: "EV6", sharedVehicle: "IONIQ5" },
    { domain: "배터리", system: "BPA", modularSystem: "BATTERY PACK", part: "Lower Case", spec: "Aluminum-Extrusion", moldCost: 450, targetVehicle: "EV6", sharedVehicle: "IONIQ5" },

    // IONIQ5
    { domain: "시트/칵핏", system: "시트", modularSystem: "FR SEAT", part: "Front Seat Frame", spec: "Leather-Type A", moldCost: 30, targetVehicle: "IONIQ5", sharedVehicle: "EV6" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "RR SEAT", part: "Rear Seat Cushion", spec: "Standard", moldCost: 45, targetVehicle: "IONIQ5", sharedVehicle: "EV6, GV60" },
    { domain: "시트/칵핏", system: "칵핏모듈", modularSystem: "IP MODULE", part: "Main Board", spec: "12.3-inch", moldCost: 120, targetVehicle: "IONIQ5", sharedVehicle: "EV6" },
    { domain: "전장", system: "AVN", modularSystem: "HEAD UNIT", part: "Display Panel", spec: "Curved Display", moldCost: 200, targetVehicle: "IONIQ5", sharedVehicle: "EV9, EV6" },
    { domain: "파워트레인", system: "인버터", modularSystem: "PCU", part: "Power Module", spec: "800V High Power", moldCost: 350, targetVehicle: "IONIQ5", sharedVehicle: "IONIQ6, EV6" },
    { domain: "바디", system: "후드", modularSystem: "FRONT BODY", part: "Hood Inner Panel", spec: "Aluminum-AL5052", moldCost: 180, targetVehicle: "IONIQ5", sharedVehicle: "EV6" },
    { domain: "배터리", system: "BPA", modularSystem: "BATTERY PACK", part: "Lower Case", spec: "Aluminum-Extrusion", moldCost: 450, targetVehicle: "IONIQ5", sharedVehicle: "EV6" },

    // GV60
    { domain: "시트/칵핏", system: "시트", modularSystem: "FR SEAT", part: "Front Seat Frame", spec: "Leather-Type A", moldCost: 30, targetVehicle: "GV60", sharedVehicle: "EV6, IONIQ5" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "RR SEAT", part: "Rear Seat Cushion", spec: "Standard", moldCost: 45, targetVehicle: "GV60", sharedVehicle: "EV6, IONIQ5" },
    { domain: "시트/칵핏", system: "칵핏모듈", modularSystem: "IP MODULE", part: "Main Board", spec: "12.3-inch", moldCost: 120, targetVehicle: "GV60", sharedVehicle: "EV6" },
    { domain: "전장", system: "AVN", modularSystem: "HEAD UNIT", part: "Display Panel", spec: "Curved Display", moldCost: 200, targetVehicle: "GV60", sharedVehicle: "EV9, IONIQ7" },
    { domain: "파워트레인", system: "인버터", modularSystem: "PCU", part: "Power Module", spec: "800V High Power", moldCost: 350, targetVehicle: "GV60", sharedVehicle: "IONIQ6, IONIQ5" },
    { domain: "바디", system: "후드", modularSystem: "FRONT BODY", part: "Hood Inner Panel", spec: "Aluminum-AL5052", moldCost: 180, targetVehicle: "GV60", sharedVehicle: "IONIQ5" },
    { domain: "배터리", system: "BPA", modularSystem: "BATTERY PACK", part: "Lower Case", spec: "Aluminum-Extrusion", moldCost: 450, targetVehicle: "GV60", sharedVehicle: "IONIQ5" },

    // K8
    { domain: "시트/칵핏", system: "시트", modularSystem: "FR SEAT", part: "Front Seat Frame", spec: "Leather-Type A", moldCost: 30, targetVehicle: "K8", sharedVehicle: "Grandeur" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "RR SEAT", part: "Rear Seat Cushion", spec: "Standard", moldCost: 45, targetVehicle: "K8", sharedVehicle: "Grandeur, K9" },
    { domain: "시트/칵핏", system: "칵핏모듈", modularSystem: "IP MODULE", part: "Main Board", spec: "12.3-inch", moldCost: 120, targetVehicle: "K8", sharedVehicle: "K9" },
    { domain: "전장", system: "AVN", modularSystem: "HEAD UNIT", part: "Display Panel", spec: "Curved Display", moldCost: 200, targetVehicle: "K8", sharedVehicle: "Grandeur" },
    { domain: "파워트레인", system: "인버터", modularSystem: "PCU", part: "Power Module", spec: "Standard", moldCost: 250, targetVehicle: "K8", sharedVehicle: "K5, Sonata" },
    { domain: "바디", system: "후드", modularSystem: "FRONT BODY", part: "Hood Inner Panel", spec: "Aluminum-AL5052", moldCost: 180, targetVehicle: "K8", sharedVehicle: "Grandeur" },
    { domain: "배터리", system: "BPA", modularSystem: "BATTERY PACK", part: "Lower Case", spec: "N/A", moldCost: 0, targetVehicle: "K8", sharedVehicle: "K9" },

    // Grandeur
    { domain: "시트/칵핏", system: "시트", modularSystem: "FR SEAT", part: "Front Seat Frame", spec: "Leather-Type A", moldCost: 30, targetVehicle: "Grandeur", sharedVehicle: "K8" },
    { domain: "시트/칵핏", system: "시트", modularSystem: "RR SEAT", part: "Rear Seat Cushion", spec: "Standard", moldCost: 45, targetVehicle: "Grandeur", sharedVehicle: "K8, K9" },
    { domain: "시트/칵핏", system: "칵핏모듈", modularSystem: "IP MODULE", part: "Main Board", spec: "12.3-inch", moldCost: 120, targetVehicle: "Grandeur", sharedVehicle: "K8" },
    { domain: "전장", system: "AVN", modularSystem: "HEAD UNIT", part: "Display Panel", spec: "Curved Display", moldCost: 200, targetVehicle: "Grandeur", sharedVehicle: "K8" },
    { domain: "파워트레인", system: "인버터", modularSystem: "PCU", part: "Power Module", spec: "Standard", moldCost: 250, targetVehicle: "Grandeur", sharedVehicle: "Sonata, K5" },
    { domain: "바디", system: "후드", modularSystem: "FRONT BODY", part: "Hood Inner Panel", spec: "Aluminum-AL5052", moldCost: 180, targetVehicle: "Grandeur", sharedVehicle: "K8" },
    { domain: "배터리", system: "BPA", modularSystem: "BATTERY PACK", part: "Lower Case", spec: "N/A", moldCost: 0, targetVehicle: "Grandeur", sharedVehicle: "K8" },

    // 추가적인 시스템들 샘플
    { domain: "섀시", system: "제동", modularSystem: "ABS MODULE", part: "Valve Block", spec: "Aluminum-L4", moldCost: 55, targetVehicle: "EV6", sharedVehicle: "IONIQ5, GV60" },
    { domain: "섀시", system: "현가", modularSystem: "AIR SUS", part: "Air Spring Case", spec: "Multi-Chamber", moldCost: 95, targetVehicle: "G90", sharedVehicle: "G80" },
    { domain: "의장", system: "도어트림", modularSystem: "DOOR MODULE", part: "Armrest Support", spec: "Soft-Touch", moldCost: 28, targetVehicle: "K5", sharedVehicle: "Sonata" },
    { domain: "바디", system: "사이드", modularSystem: "SIDE STRUCTURE", part: "Center Pillar", spec: "Hot Stamping", moldCost: 150, targetVehicle: "Sorento", sharedVehicle: "Santa Fe" },
    { domain: "공조", system: "HVAC", modularSystem: "AIR CONDITIONING", part: "Evaporator Case", spec: "Plastic-PP", moldCost: 45, targetVehicle: "Avante", sharedVehicle: "K3" },
    { domain: "램프", system: "헤드램프", modularSystem: "FRONT LIGHTING", part: "Lens Cover", spec: "PC-Clear", moldCost: 110, targetVehicle: "Grandeur", sharedVehicle: "K8" },
    { domain: "전장", system: "ADAS", modularSystem: "FRONT CAMERA", part: "Camera Bracket", spec: "Glass-Fiber-PA", moldCost: 12, targetVehicle: "GV80", sharedVehicle: "GV70" },
    { domain: "구동", system: "감속기", modularSystem: "EDU", part: "Gear Housing", spec: "Aluminum-ALDC12", moldCost: 280, targetVehicle: "IONIQ5", sharedVehicle: "EV6" }
];

export default partsData;
