import { HardDiskComponentData } from "./types";

export const HARD_DISK_COMPONENTS: HardDiskComponentData[] = [
  {
    id: "hdd-casing",
    name: "Hard Disk Drive Enclosure",
    category: "Enclosure",
    shortDescription: "Protective aluminum housing that shields internal components from dust and physical damage.",
    fullDescription:
      "The 3.5-inch hard disk drive enclosure is made from durable aluminum alloy to provide electromagnetic interference (EMI) shielding and structural rigidity. This casing protects the delicate internal components and helps dissipate heat generated during operation. The mounting holes on the sides allow secure attachment to a PC chassis using standard screws.",
    installationSteps: [
      "Identify the correct bay in your PC case (usually a 3.5-inch drive bay).",
      "If the drive bay uses tool-less screws, align the drive mounting tabs with the tray.",
      "If screws are required, align the mounting holes and secure with 4 screws (2 per side).",
      "Ensure the drive is firmly seated and doesn't rattle.",
    ],
    specs: [
      { label: "Form Factor", value: "3.5-inch standard" },
      { label: "Material", value: "Aluminum alloy with steel bottom plate" },
      { label: "Weight", value: "Approximately 600-700g (drive included)" },
    ],
    position: [0, 0, 0],
    size: [6, 3.5, 1],
    color: "#64748b",
    highlightColor: "#94a3b8",
  },
  {
    id: "pcba-board",
    name: "PCBA (Printed Circuit Board Assembly)",
    category: "Electronics",
    shortDescription: "The main control board that manages all disk operations and data transfer.",
    fullDescription:
      "The PCBA is the brain of the hard drive, containing the disk controller chip, cache memory (typically 64MB-256MB), and interface electronics. This board translates commands from your computer into precise mechanical movements and read/write operations. It also handles error correction, data caching, and power management to optimize performance and reliability.",
    installationSteps: [
      "This component is factory-installed and should not be removed or modified.",
      "When connecting the drive, handle by the edges to avoid electrostatic discharge (ESD) damage.",
      "Ensure the SATA data and power connectors are clean and undamaged.",
    ],
    specs: [
      { label: "Controller", value: "Custom ASIC with embedded processor" },
      { label: "Cache Memory", value: "128MB DDR3/DDR4 (varies by model)" },
      { label: "Interface", value: "SATA III 6Gb/s" },
    ],
    position: [0, 1.85, 0],
    size: [5.8, 3.2, 0.1],
    color: "#065f46",
    highlightColor: "#10b981",
  },
  {
    id: "spindle-motor",
    name: "Spindle Motor Assembly",
    category: "Mechanical",
    shortDescription: "High-precision motor that rotates the magnetic platters at constant speed.",
    fullDescription:
      "The spindle motor is a brushless DC motor that spins the hard disk platters at a precise rotational speed (typically 5400 RPM, 7200 RPM, or higher for enterprise drives). This motor uses magnetic bearings for smooth, low-vibration operation and includes a rotor with precise balance to maintain accuracy at high speeds. Consistent rotational speed is critical for data integrity and access times.",
    installationSteps: [
      "The spindle motor is permanently assembled inside the drive enclosure.",
      "Do not attempt to disassemble or lubricate - this will permanently damage the drive.",
      "Ensure adequate airflow around the drive to prevent motor overheating.",
    ],
    specs: [
      { label: "Motor Type", value: "Brushless DC with magnetic bearings" },
      { label: "Speed", value: "7200 RPM (varies by model)" },
      { label: "Power Consumption", value: "3-8 watts during operation" },
    ],
    position: [0, 1.4, 0.15],
    size: [1.5, 1.5, 0.3],
    color: "#374151",
    highlightColor: "#6b7280",
  },
  {
    id: "platters",
    name: "Magnetic Platters (Disks)",
    category: "Storage Medium",
    shortDescription: "Aluminum or glass disks coated with magnetic material for data storage.",
    fullDescription:
      "The platters are the actual data storage medium, typically made from aluminum alloy or glass with a thin magnetic coating. Multiple platters can be stacked on the spindle motor (this drive has 2 platters for 4 heads). Each platter surface is divided into concentric tracks and sectors where data is magnetically recorded. The smooth surface and precise coating enable high data density and fast access times.",
    installationSteps: [
      "Platters are sealed inside the drive's cleanroom assembly.",
      "Never attempt to open the drive enclosure - even microscopic dust particles can destroy platter surfaces.",
    ],
    specs: [
      { label: "Material", value: "Aluminum alloy with magnetic thin-film coating" },
      { label: "Number", value: "2 platters (4 recording surfaces)" },
      { label: "Diameter", value: "3.5 inches (88.9 mm)" },
    ],
    position: [0, 1.5, 0.25],
    size: [5, 5, 0.02],
    color: "#9ca3af",
    highlightColor: "#d1d5db",
  },
  {
    id: "actuator-assembly",
    name: "Actuator Assembly with Read/Write Heads",
    category: "Mechanical",
    shortDescription: "Precision mechanism that positions the read/write heads over specific disk tracks.",
    fullDescription:
      "The actuator assembly contains the voice coil motor and actuator arm that positions the read/write heads with extreme precision (within nanometers). Each platter surface has its own dedicated head on the actuator arm. This assembly must move heads across the platter surface hundreds of times per second during normal operation, requiring sub-micron positioning accuracy for reliable data access.",
    installationSteps: [
      "Factory-assembled and sealed inside the cleanroom environment.",
      "The parking ramp protects heads when the drive is powered off.",
    ],
    specs: [
      { label: "Actuator Type", value: "Voice coil motor (VCM)" },
      { label: "Head Count", value: "4 read/write heads (2 per platter)" },
      { label: "Access Time", value: "Typically 8-12ms" },
    ],
    position: [1.5, 1.4, 0],
    size: [2, 3, 0.2],
    color: "#475569",
    highlightColor: "#64748b",
  },
  {
    id: "sata-connectors",
    name: "SATA Data and Power Connectors",
    category: "Connectivity",
    shortDescription: "Interface connectors for connecting the drive to motherboard and power supply.",
    fullDescription:
      "The SATA interface consists of two separate connectors: a 7-pin data connector for transferring information to/from the motherboard via SATA cable, and a 15-pin power connector that provides 3.3V, 5V, and 12V power from the PSU. This serial interface replaced older parallel ATA (PATA) technology, offering faster data rates and thinner, more manageable cables.",
    installationSteps: [
      "Connect the SATA data cable from the motherboard to the data connector (smaller connector).",
      "Connect the SATA power cable from the PSU to the power connector (wider connector).",
      "Ensure connectors click firmly into place - loose connections cause drive detection issues.",
    ],
    specs: [
      { label: "Data Interface", value: "SATA III (6 Gb/s theoretical, ~600 MB/s actual)" },
      { label: "Power Rails", value: "3.3V, 5V, 12V" },
      { label: "Hot-Plug Support", value: "Yes (when enabled in BIOS/OS)" },
    ],
    position: [3, 0, -0.5],
    size: [0.5, 1.5, 0.1],
    color: "#334155",
    highlightColor: "#f97316",
  },
];
