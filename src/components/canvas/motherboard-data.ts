import { MotherboardComponentData } from "./types";

export const MOTHERBOARD_COMPONENTS: MotherboardComponentData[] = [
  {
    id: "cpu-socket",
    name: "CPU Socket (LGA 1700 / AM5)",
    category: "Processor",
    shortDescription: "The central socket that houses and powers the processor.",
    fullDescription:
      "The CPU socket connects the central processing unit to the rest of the motherboard circuitry. Modern sockets feature land grid array (LGA) pins with high electrical contact density, secured by a steel retention latch mechanism.",
    installationSteps: [
      "Lift the metal retention load lever by pressing outward and up.",
      "Open the socket retention plate gently.",
      "Align the golden triangle marker on the CPU with the marker on the socket corner.",
      "Carefully lower the CPU straight into the socket without sliding.",
      "Close the plate and secure the lever under the catch tab.",
    ],
    specs: [
      { label: "Form Factor", value: "LGA / Land Grid Array" },
      { label: "Supported Pin Count", value: "1,700 contacts" },
      { label: "Retention Mechanism", value: "Dual-hinged steel bracket" },
    ],
    position: [-1.2, 0.22, 1.2],
    size: [2.0, 0.18, 2.0],
    color: "#cbd5e1",
    highlightColor: "#3b82f6",
  },
  {
    id: "ram-slots",
    name: "DDR5 Memory DIMM Slots",
    category: "Memory",
    shortDescription: "Four dual-channel slots for high-speed DDR5 system memory.",
    fullDescription:
      "Dual In-line Memory Module slots provide direct high-bandwidth memory access to the CPU memory controller. Configured for dual-channel architecture; populating slots 2 and 4 (A2/B2) first ensures maximum signal integrity and XMP/EXPO stability.",
    installationSteps: [
      "Open the retention clips at both ends of slots 2 and 4 (from left).",
      "Align the notch on the bottom of the DDR5 stick with the key in the slot.",
      "Apply firm, even downward pressure on both ends until the clips snap closed with an audible click.",
    ],
    specs: [
      { label: "Memory Standard", value: "DDR5 up to 8000+ MT/s (OC)" },
      { label: "Max Capacity", value: "192 GB (4 x 48GB)" },
      { label: "Channels", value: "Dual Channel (128-bit bus)" },
    ],
    position: [1.8, 0.22, 1.2],
    size: [1.8, 0.35, 2.6],
    color: "#334155",
    highlightColor: "#60a5fa",
  },
  {
    id: "pcie-x16-main",
    name: "Primary PCIe 5.0 x16 Slot",
    category: "Expansion",
    shortDescription: "Steel-armored expansion slot for dedicated graphics card.",
    fullDescription:
      "The primary PCI Express slot routes 16 lanes directly from the CPU for ultra-low latency graphics card communication. Reinforced with steel shielding to withstand heavy modern GPU weight and prevent PCB bending or signal interference.",
    installationSteps: [
      "Open the slot retention latch at the right edge.",
      "Remove corresponding I/O bracket covers from your PC case.",
      "Align GPU gold fingers directly over the slot.",
      "Press downward until the retention latch snaps into locked position.",
      "Secure GPU bracket to chassis with thumbscrews.",
    ],
    specs: [
      { label: "Interface", value: "PCIe 5.0 x16 (CPU Direct)" },
      { label: "Bandwidth", value: "128 GB/s bidirectional" },
      { label: "Reinforcement", value: "Steel Armor + Anchor Points" },
    ],
    position: [-0.6, 0.2, -0.9],
    size: [4.4, 0.22, 0.35],
    color: "#94a3b8",
    highlightColor: "#38bdf8",
  },
  {
    id: "pcie-x16-secondary",
    name: "Secondary PCIe 4.0 Slot",
    category: "Expansion",
    shortDescription: "Secondary expansion slot for capture cards, sound cards, or high-speed RAID.",
    fullDescription:
      "Routes PCIe lanes through the motherboard chipset, supporting supplemental add-in cards such as 10GbE network cards, PCIe video capture cards, or additional M.2 carrier boards.",
    installationSteps: [
      "Push latch open.",
      "Align card fingers and push firmly until seated.",
      "Fasten slot bracket screw.",
    ],
    specs: [
      { label: "Interface", value: "PCIe 4.0 x4 electrical" },
      { label: "Controller", value: "Chipset Bus" },
      { label: "Form Factor", value: "Full-length physical x16" },
    ],
    position: [-0.6, 0.2, -2.6],
    size: [4.4, 0.2, 0.35],
    color: "#475569",
    highlightColor: "#818cf8",
  },
  {
    id: "m2-slot-1",
    name: "Gen5 M.2 NVMe SSD Heatsink",
    category: "Storage",
    shortDescription: "Blazing fast NVMe storage slot with thick thermal dissipator.",
    fullDescription:
      "Houses M.2 2280 format solid-state drives using PCIe 5.0 x4 throughput. Features tool-less EZ-latch mounting and a multi-layer finned aluminum thermal pad heatsink that prevents thermal throttling under continuous disk writes.",
    installationSteps: [
      "Remove the heatsink screw using a PH1 screwdriver.",
      "Peel protective plastic film off thermal silicone pad.",
      "Insert M.2 SSD at a 30-degree angle into the M-key connector.",
      "Press SSD down and latch with the tool-free rotating clip.",
      "Reattach top aluminum heatsink and tighten screws.",
    ],
    specs: [
      { label: "Form Factor", value: "M.2 2280 / 22110 Key-M" },
      { label: "Bus Speed", value: "PCIe Gen 5 x4 (up to 14,000 MB/s)" },
      { label: "Cooling", value: "Double-sided Thermal Shield" },
    ],
    position: [-0.6, 0.24, 0.15],
    size: [3.2, 0.18, 0.8],
    color: "#1e293b",
    highlightColor: "#a855f7",
  },
  {
    id: "vrm-heatsink",
    name: "VRM Power Stage Heatsinks",
    category: "Cooling",
    shortDescription: "Heavy extruded aluminum heatsinks cooling the 16+1+1 power phases.",
    fullDescription:
      "Voltage Regulator Modules convert raw 12V power from the power supply down to precise ~1.2V core voltages for the processor. The large anodized aluminum heatsinks keep MOSFET temperatures under 65°C under heavy compute workloads.",
    installationSteps: [
      "Factory installed. Ensure chassis front intake fans provide crossflow airflow over VRM fins.",
    ],
    specs: [
      { label: "Phases", value: "16+1+1 Digital VRM Stages" },
      { label: "Current Rating", value: "90A Smart Power Stages" },
      { label: "Material", value: "CNC Anodized Aluminum with Heatpipe" },
    ],
    position: [-2.2, 0.45, 2.5],
    size: [3.8, 0.65, 1.2],
    color: "#0f172a",
    highlightColor: "#f59e0b",
  },
  {
    id: "chipset",
    name: "PCH Motherboard Chipset",
    category: "Power",
    shortDescription: "Platform Controller Hub coordinating I/O, SATA, and USB lanes.",
    fullDescription:
      "The motherboard's central I/O brain managing SATA drives, auxiliary PCIe lanes, audio codecs, Wi-Fi 7 module, and legacy onboard peripherals.",
    installationSteps: [
      "Integrated into board under custom passive cooling block.",
    ],
    specs: [
      { label: "Chipset Tier", value: "Z790 / X670 High-End" },
      { label: "DMI Link", value: "DMI 4.0 x8 (CPU Interconnect)" },
      { label: "TDP", value: "6 Watts passive" },
    ],
    position: [2.5, 0.3, -1.6],
    size: [1.8, 0.25, 1.8],
    color: "#1e293b",
    highlightColor: "#10b981",
  },
  {
    id: "rear-io",
    name: "Rear I/O Shield & Connectivity",
    category: "Connectivity",
    shortDescription: "Integrated rear shield with Thunderbolt 4, 2.5G LAN, and Wi-Fi antennas.",
    fullDescription:
      "Pre-mounted I/O shield containing high-speed external ports: USB-C 20Gbps, USB 3.2 Gen 2 ports, 2.5GbE Ethernet, gold-plated audio jacks with optical S/PDIF, and SMA antenna connectors.",
    installationSteps: [
      "Pre-installed on motherboard. When placing motherboard in chassis, align shield directly into the rear case cutout.",
    ],
    specs: [
      { label: "USB Ports", value: "2x USB-C (Thunderbolt 4) + 8x USB-A" },
      { label: "Networking", value: "Intel 2.5 Gbps Ethernet + Wi-Fi 7" },
      { label: "Audio", value: "Realtek ALC4080 7.1 HD Surround" },
    ],
    position: [-4.6, 0.55, 1.4],
    size: [0.7, 0.9, 3.8],
    color: "#334155",
    highlightColor: "#06b6d4",
  },
  {
    id: "atx-24pin",
    name: "24-Pin ATX Main Power",
    category: "Power",
    shortDescription: "Primary electrical power supply connection for the entire motherboard.",
    fullDescription:
      "Supplies +3.3V, +5V, +12V, and standby rails to the PCB from the ATX power supply unit. Uses solid pin contacts for reduced electrical resistance and voltage ripple.",
    installationSteps: [
      "Orient the 24-pin cable clip with the latch on the connector edge.",
      "Push firmly until the side clip locks onto the motherboard header.",
    ],
    specs: [
      { label: "Standard", value: "ATX12V 24-pin keyed connector" },
      { label: "Voltage Inputs", value: "+3.3V, +5V, +12V, -12V, +5VSB" },
    ],
    position: [4.4, 0.32, 1.4],
    size: [0.6, 0.45, 2.2],
    color: "#1e293b",
    highlightColor: "#eab308",
  },
  {
    id: "eps-8pin",
    name: "8+4 Pin CPU Power (EPS 12V)",
    category: "Power",
    shortDescription: "Dedicated 12V power inputs delivering up to 384W to the CPU socket.",
    fullDescription:
      "Provides dedicated +12V rail power directly to the VRM power stages for high-draw processor boost frequencies and extreme overclocking.",
    installationSteps: [
      "Connect the 8-pin EPS cable labeled 'CPU' from power supply.",
      "For high-wattage CPUs (e.g. Core i9 / Ryzen 9), also connect the secondary 4-pin cable.",
    ],
    specs: [
      { label: "Connector", value: "8-pin + 4-pin EPS 12V" },
      { label: "Power Capacity", value: "384W + 192W continuous" },
    ],
    position: [-3.8, 0.35, 3.5],
    size: [1.2, 0.4, 0.6],
    color: "#0f172a",
    highlightColor: "#f97316",
  },
  {
    id: "sata-ports",
    name: "SATA 6Gb/s Ports",
    category: "Storage",
    shortDescription: "Four right-angle SATA III data connectors for 2.5\" SSDs and 3.5\" HDDs.",
    fullDescription:
      "Right-angled connectors routed along the board edge so large graphics cards do not obstruct storage data cables. Operates at up to 600 MB/s per port.",
    installationSteps: [
      "Plug L-shaped SATA data cable into port until clip clicks.",
      "Connect opposite end to SATA SSD or mechanical hard drive.",
    ],
    specs: [
      { label: "Speed", value: "SATA Revision 3.0 (6 Gbps)" },
      { label: "Port Count", value: "4x right-angle stacked headers" },
    ],
    position: [4.5, 0.28, -1.8],
    size: [0.65, 0.35, 1.4],
    color: "#0f172a",
    highlightColor: "#14b8a6",
  },
  {
    id: "audio-section",
    name: "Isolated Hi-Fi Audio Section",
    category: "Connectivity",
    shortDescription: "Electrically isolated PCB zone with gold Japanese Nichicon capacitors.",
    fullDescription:
      "Separated from the rest of the PCB by a trace-isolation trench to block analog electromagnetic interference from high-frequency GPU and memory clocks, ensuring crystal-clear audio SNR.",
    installationSteps: [
      "Connect front-panel HD Audio header cable from chassis to the bottom-left 9-pin audio pin header.",
    ],
    specs: [
      { label: "Capacitors", value: "Premium Nichicon Gold Series" },
      { label: "Shielding", value: "Dedicated PCB Isolation Line" },
      { label: "DAC Resolution", value: "32-bit / 384kHz playback" },
    ],
    position: [-4.2, 0.22, -2.5],
    size: [1.2, 0.25, 1.8],
    color: "#1e293b",
    highlightColor: "#ec4899",
  },
];

export const motherboardComponents = MOTHERBOARD_COMPONENTS;
