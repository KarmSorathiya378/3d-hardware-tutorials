export const TOPICS = {
  board: "Motherboard",
  compute: "CPU & memory",
  storage: "Storage",
  ports: "Ports & connections",
  power: "Power & cooling",
  assembly: "Assembly & firmware",
  performance: "Performance",
  reliability: "Data & reliability",
} as const;
export type Topic = keyof typeof TOPICS;
export type Level = "Foundation" | "Applied" | "Advanced";
export type Format = "single" | "multiple" | "boolean" | "match" | "order" | "visual";
export type Question = {
  id: string; topic: Topic; level: Level; format: Format; prompt: string;
  options: string[]; answer: string[]; explanation: string;
  labels?: string[]; source: string;
};
const sources: Record<Topic, string> = {
  board: "https://www.intel.com/content/www/us/en/gaming/resources/how-to-choose-a-motherboard.html",
  compute: "https://www.kingston.com/en/support/technical/products/server-memory",
  storage: "https://www.kingston.com/en/ssd/ssd-faq",
  ports: "https://usb.org/usb-type-cr-cable-and-connector-specification",
  power: "https://www.corsair.com/ww/pl/s/legacy-psu-cable-compatibility",
  assembly: "https://www.intel.com/content/www/us/en/support/articles/000092149/processors.html",
  performance: "https://www.intel.com/content/www/us/en/support/articles/000088048/processors.html",
  reliability: "https://www.seagate.com/support/kb/my-system-reported-a-smart-error-on-the-drive-184619en/",
};
const bank: Question[] = [];
function q(topic: Topic, level: Level, prompt: string, options: string[], answer: string[], explanation: string, format: Format = "single", labels?: string[]) {
  bank.push({ id: `${topic}-${bank.filter(x => x.topic === topic).length + 1}`, topic, level, prompt, options, answer, explanation, format, labels, source: sources[topic] });
}
const F = "Foundation", A = "Applied", X = "Advanced";
q("board",F,"What is the motherboard’s main role?",["Connect components and carry their signals","Store every file permanently","Convert mains AC to DC","Render every image"],["Connect components and carry their signals"],"The motherboard provides the sockets, slots, circuits and connections that let the system work together.");
q("board",F,"Which slot normally accepts a desktop graphics card?",["PCIe x16","DIMM","SATA","CPU socket"],["PCIe x16"],"A graphics card normally fits a physical PCIe x16 slot. The available electrical lanes depend on the board and slot.");
q("board",F,"Match each motherboard feature to its purpose.",["Holds system memory","Connects the processor","Supplies regulated CPU voltage","Provides external connections"],["Connects the processor","Holds system memory","Supplies regulated CPU voltage","Provides external connections"],"The socket, DIMM slots, VRM and rear I/O serve different physical and electrical roles.","match",["CPU socket","DIMM slots","VRM","Rear I/O"]);
q("board",A,"Before fitting a motherboard in a case, what should you check? Select all that apply.",["Supported form factor","Standoff positions","Cooler and card clearance","Matching brand of keyboard"],["Supported form factor","Standoff positions","Cooler and card clearance"],"Physical compatibility includes board size, correctly positioned standoffs and space for installed components.","multiple");
q("board",A,"A long PCIe slot always provides 16 electrical lanes.",["True","False"],["False"],"A physical x16 connector can be wired for fewer lanes. Read the board’s slot and lane-sharing specifications.","boolean");
q("board",X,"Installing a second M.2 drive disables a SATA port. What is the most likely explanation?",["Shared chipset or board resources","The SSD uses too much RAM","All SATA drives require drivers to appear","The case is too small"],["Shared chipset or board resources"],"Some sockets and ports share resources. The motherboard manual documents which combinations are available.");
q("board",X,"What connects a chipset to the CPU on many Intel desktop platforms?",["DMI","HDMI","SATA power","A fan header"],["DMI"],"DMI is the chipset-to-processor link on many Intel platforms; chipset devices share its aggregate bandwidth.");
q("board",F,"Select the letter marking the CPU socket.",["A","B","C","D"],["A"],"A marks the CPU socket. B marks memory slots, C the main PCIe slot and D the 24-pin power connector.","visual");

q("compute",F,"Which component executes general-purpose program instructions?",["CPU","PSU","Case fan","SATA cable"],["CPU"],"The CPU executes instructions. Storage holds data, memory supplies working data and the PSU provides power.");
q("compute",F,"Ordinary system RAM retains your files when all power is removed.",["True","False"],["False"],"DRAM is volatile working memory. Persistent files belong on nonvolatile storage.","boolean");
q("compute",F,"Select the letter marking the DIMM memory slots.",["A","B","C","D"],["B"],"B marks the long DIMM slots beside the CPU socket.","visual");
q("compute",A,"What must be checked before installing a CPU? Select all that apply.",["Socket compatibility","Motherboard CPU support list","Required firmware version","Whether the CPU and case share a brand"],["Socket compatibility","Motherboard CPU support list","Required firmware version"],"A matching socket alone is insufficient: chipset support and a compatible BIOS/UEFI version also matter.","multiple");
q("compute",A,"A board manual recommends A2 and B2 for two DIMMs. Where should you install them?",["A2 and B2","Any two adjacent slots","Only A1","All four slots with two modules"],["A2 and B2"],"Follow the board’s population guide. The recommended pair usually enables the intended two-channel configuration.");
q("compute",A,"DDR4 and DDR5 desktop DIMMs can be freely swapped in the same slot.",["True","False"],["False"],"The generations differ in electrical requirements and keying. Use the memory generation specified by the motherboard.","boolean");
q("compute",X,"DDR5 on-die ECC means every DDR5 desktop system has full system ECC protection.",["True","False"],["False"],"On-die ECC corrects certain errors inside the memory chip. System ECC also needs compatible memory, CPU and board support for the wider data path.","boolean");
q("compute",X,"Why can four DIMMs require a lower stable memory speed than two?",["Greater electrical loading on the memory controller","More DIMMs reduce storage capacity","Four DIMMs disable every CPU cache","The operating system forbids four DIMMs"],["Greater electrical loading on the memory controller"],"DIMM count, ranks, controller capability and board routing influence stable memory speed. Rated kit speeds are not universal guarantees.");

q("storage",F,"Which drive stores data on rotating magnetic platters?",["HDD","NVMe SSD","SATA SSD","RAM"],["HDD"],"Hard disk drives use magnetic platters and moving heads. SSDs use nonvolatile flash.");
q("storage",F,"Match the storage term to its meaning.",["Flash-based storage device","Magnetic rotating drive","Storage command protocol over PCIe","Physical module form factor"],["Magnetic rotating drive","Flash-based storage device","Physical module form factor","Storage command protocol over PCIe"],"M.2 describes a module form factor; NVMe is a protocol. An M.2 module is not automatically NVMe.","match",["HDD","SSD","M.2","NVMe"]);
q("storage",A,"Every M.2 SSD uses NVMe.",["True","False"],["False"],"M.2 SSDs may use SATA or PCIe/NVMe. A matching physical shape does not guarantee slot compatibility.","boolean");
q("storage",A,"What does a typical internal 2.5-inch SATA SSD need? Select all that apply.",["SATA data connection","SATA power connection","A CPU socket","An external HDMI cable"],["SATA data connection","SATA power connection"],"The data cable connects to a SATA host port; a separate PSU cable supplies power.","multiple");
q("storage",X,"What does TRIM communicate to an SSD?",["Which logical blocks are no longer needed","Which fan must spin faster","Which RAM channel to disable","Which file should be encrypted"],["Which logical blocks are no longer needed"],"TRIM lets the controller know that certain logical blocks no longer contain needed data, helping it manage flash.");
q("storage",X,"What is SSD wear leveling intended to do?",["Spread writes across flash cells","Keep the drive physically level","Guarantee an unlimited lifespan","Defragment every file"],["Spread writes across flash cells"],"Flash has finite program/erase endurance. Wear leveling distributes use to avoid wearing out a small area early.");
q("storage",A,"Why does an SSD usually feel faster than an HDD when opening many small files?",["Much lower access latency","It always has more capacity","It never needs power","It uses a faster display cable"],["Much lower access latency"],"SSDs do not wait for mechanical head movement or platter rotation, which helps random access.");
q("storage",X,"Which specification describes an SSD’s rated cumulative write endurance?",["TBW","RPM","Screen refresh rate","DIMM count"],["TBW"],"Terabytes written is a write-endurance rating under specified conditions. It is not a prediction of the exact failure time.");

q("ports",F,"Which rear-panel port normally connects wired networking?",["Ethernet","Audio line-out","HDMI","PS/2 mouse"],["Ethernet"],"Ethernet connects the computer to a wired local network, typically using an 8P8C connector often called RJ45.");
q("ports",F,"Match the connection to its typical task.",["Display output","Wired network","Analog headphones or speakers","USB peripherals"],["Display output","Wired network","Analog headphones or speakers","USB peripherals"],"These are typical uses. Specific port capabilities depend on the device.","match",["HDMI","Ethernet","3.5 mm line-out","USB-A"]);
q("ports",A,"A USB-C connector guarantees video output.",["True","False"],["False"],"USB-C describes a connector. Video, transfer speed and power capabilities depend on the port, device and cable.","boolean");
q("ports",A,"The tower’s front USB ports do not work after assembly. Which connection should you inspect first?",["The front USB cable and matching board header","The monitor stand","The CPU socket latch","The rear audio jack"],["The front USB cable and matching board header"],"Case USB ports need their internal cable connected to the appropriate motherboard header. Power down before reseating internal cables.");
q("ports",A,"A dedicated graphics card is installed. Where should a gaming monitor normally connect?",["A video output on the graphics card","A SATA data connector","An Ethernet jack","A CPU fan header"],["A video output on the graphics card"],"Connect the monitor to the card to use its outputs. Motherboard display outputs depend on supported integrated graphics.");
q("ports",X,"What limits a USB connection’s usable capability? Select all that apply.",["Host port support","Cable capability","Connected device support","Connector color alone"],["Host port support","Cable capability","Connected device support"],"The whole connection must support the feature. Connector shape or color alone is insufficient evidence.","multiple");
q("ports",F,"What does a case power button usually connect to?",["The board’s front-panel header","A SATA port","The graphics card’s HDMI port","A memory slot"],["The board’s front-panel header"],"The momentary power switch connects to the designated pins in the motherboard’s front-panel header.");
q("ports",X,"Can a motherboard video output work with every CPU that fits its socket?",["No; compatible graphics support is also needed","Yes; the connector creates graphics itself","Yes; installing more RAM always enables it","Only if an Ethernet cable is attached"],["No; compatible graphics support is also needed"],"The CPU/platform must provide the required graphics capability, and firmware configuration can affect available outputs.");

q("power",F,"What does the PSU primarily do?",["Convert AC input into regulated DC outputs","Store the operating system","Decode keyboard input","Increase RAM capacity"],["Convert AC input into regulated DC outputs"],"The PSU supplies the DC rails used by PC components.");
q("power",F,"Select the letter marking the 24-pin motherboard power connector.",["A","B","C","D"],["D"],"D marks the main 24-pin power connector along the board edge.","visual");
q("power",A,"Modular PSU cables from different models are always interchangeable if they fit.",["True","False"],["False"],"PSU-side wiring can differ even when connectors fit. Use only cables explicitly compatible with the exact PSU.","boolean");
q("power",A,"What should be checked when selecting a PSU? Select all that apply.",["Required connectors","System power demand and headroom","Physical fit","Only the printed wattage"],["Required connectors","System power demand and headroom","Physical fit"],"Capacity, connectors, fit and quality all matter. Wattage alone does not establish suitability.","multiple");
q("power",A,"What is thermal interface material intended to do?",["Improve heat transfer across microscopic gaps","Glue RAM into its slots","Insulate a heatsink from all heat","Power the CPU"],["Improve heat transfer across microscopic gaps"],"Thermal compound improves contact between the heat spreader and cooler. Apply it according to the cooler’s guidance.");
q("power",X,"An 8-pin EPS CPU power cable and an 8-pin PCIe GPU cable can be substituted freely.",["True","False"],["False"],"Their wiring and purposes differ. Use the correctly labeled cable and never force a connector.","boolean");
q("power",X,"A CPU gets hot and reduces its frequency. What is this behavior called?",["Thermal throttling","RAID mirroring","TRIM","Memory interleaving"],["Thermal throttling"],"The processor can lower performance to stay within thermal limits. Investigate cooler mounting, airflow and workload.");
q("power",A,"A PSU appears faulty. What is the appropriate action?",["Disconnect it and arrange qualified service or replacement","Open it and touch the capacitors","Bridge random output pins","Use any cable that fits"],["Disconnect it and arrange qualified service or replacement"],"A PSU can contain dangerous stored energy. Internal repair belongs with qualified personnel.");

q("assembly",F,"What is POST?",["Power-on self-test","A storage connector","A kind of thermal paste","A display resolution"],["Power-on self-test"],"Firmware performs startup checks before handing control to a bootloader.");
q("assembly",A,"Put this simplified RAM replacement workflow in order.",["Power down, unplug and follow service precautions","Remove the old DIMM","Align and firmly seat the supported new DIMM","Reconnect power and verify memory detection"],["Power down, unplug and follow service precautions","Remove the old DIMM","Align and firmly seat the supported new DIMM","Reconnect power and verify memory detection"],"Work without live power, handle modules by their edges, align the key and verify detection after installation.","order");
q("assembly",A,"An unused metal standoff sits beneath the board where there is no mounting hole. What should you do?",["Remove or reposition it before installing the board","Leave it to improve cooling","Cover it with thermal paste","Tighten the motherboard harder"],["Remove or reposition it before installing the board"],"Incorrect standoffs can contact circuitry and cause shorts. Match the case standoff layout to the board.");
q("assembly",A,"What should you confirm before a firmware update? Select all that apply.",["Exact board model and revision","Manufacturer’s update procedure","Correct update file","That any similarly named board’s file is close enough"],["Exact board model and revision","Manufacturer’s update procedure","Correct update file"],"Use the exact supported firmware and procedure, with reliable power. An unrelated image can leave the system unbootable.","multiple");
q("assembly",X,"A supported new CPU does not boot in an older board. What should you check?",["Whether its support requires a newer BIOS/UEFI","Whether the monitor has enough storage","Whether the mouse uses USB-C","Whether the case has RGB"],["Whether its support requires a newer BIOS/UEFI"],"A support list may require a minimum firmware version. Update through the manufacturer’s supported procedure.");
q("assembly",F,"What commonly connects a case’s power LED and reset switch to the motherboard?",["Front-panel header","M.2 socket","CPU socket","PCIe slot"],["Front-panel header"],"The case’s small front-panel leads connect to designated header pins. LED polarity and pin layout should follow the manual.");
q("assembly",X,"A first boot after a memory change can take longer because of memory training.",["True","False"],["True"],"The firmware may train timings and electrical parameters. Follow the board’s guidance before interpreting a delay as a fault.","boolean");
q("assembly",A,"Put this compatibility check in order before purchasing a CPU upgrade.",["Identify the exact motherboard model","Check its CPU support list","Check the required BIOS version against the installed version","Plan a supported update if needed, then purchase"],["Identify the exact motherboard model","Check its CPU support list","Check the required BIOS version against the installed version","Plan a supported update if needed, then purchase"],"Begin with exact hardware identification. Establish support and a workable firmware update path before buying.","order");

q("performance",F,"Which change most directly increases room for simultaneously active programs when RAM is exhausted?",["More compatible RAM","A different case badge","A longer HDMI cable","A second power button"],["More compatible RAM"],"More RAM can reduce paging when memory capacity is the constraint. It does not solve every performance problem.");
q("performance",A,"A faster SSD will always increase game frame rate dramatically.",["True","False"],["False"],"Storage can improve loading and asset streaming, but rendering performance is often constrained by CPU or GPU work.","boolean");
q("performance",A,"Which measurements help investigate a slowdown? Select all that apply.",["CPU and GPU utilization","Memory pressure","Storage activity and temperatures","Only the case color"],["CPU and GPU utilization","Memory pressure","Storage activity and temperatures"],"Measure the actual workload. Utilization, memory pressure, I/O and temperatures help identify the limiting resource.","multiple");
q("performance",X,"A PCIe 4.0 device is installed in a compatible PCIe 3.0 slot. What normally happens?",["It negotiates a mutually supported link speed","It permanently upgrades the slot to PCIe 4.0","It necessarily destroys the board","It becomes a SATA device"],["It negotiates a mutually supported link speed"],"Compatible PCIe devices generally negotiate the common generation and lane width, subject to platform support.");
q("performance",X,"Why can a large SSD file copy slow down after an initially fast burst?",["A fast write cache may fill","The keyboard loses polling rate","TRIM turns the SSD into an HDD","Every SSD has the same fixed speed"],["A fast write cache may fill"],"Sustained writes can exceed a drive’s cache capacity. Native flash speed, temperature and available space also affect throughput.");
q("performance",A,"Match the metric to what it measures.",["Delay before a response","Data transferred per second","Operations completed per second","Processor cycles per second"],["Delay before a response","Data transferred per second","Operations completed per second","Processor cycles per second"],"Latency, throughput, IOPS and clock frequency describe different aspects of performance.","match",["Latency","Throughput","IOPS","Clock frequency"]);
q("performance",X,"Higher CPU clock speed alone proves one processor is faster than another.",["True","False"],["False"],"Architecture, instructions per cycle, core count, power limits and workload also matter. Compare relevant benchmark results.","boolean");
q("performance",A,"Put this performance investigation in a useful order.",["Reproduce the slowdown with a known workload","Record utilization, temperatures and memory pressure","Change one relevant variable","Repeat the workload and compare measurements"],["Reproduce the slowdown with a known workload","Record utilization, temperatures and memory pressure","Change one relevant variable","Repeat the workload and compare measurements"],"A repeatable baseline and one change at a time make results easier to interpret.","order");

q("reliability",F,"Which practice helps recover files after accidental deletion?",["Keeping tested, separate backups","Adding RGB lighting","Increasing fan speed","Using only RAID 0"],["Keeping tested, separate backups"],"A usable backup can restore lost files. Test recovery and keep copies separate from the original system.");
q("reliability",A,"RAID 1 is a complete replacement for backups.",["True","False"],["False"],"Mirroring can tolerate certain drive failures, but deletion, malware and other damage can affect both copies.","boolean");
q("reliability",A,"A drive reports a SMART failure warning. What is your first priority?",["Protect important data with a backup","Run repeated write benchmarks first","Ignore it because files still open","Disable warnings permanently"],["Protect important data with a backup"],"A SMART warning can indicate impending failure. Secure data promptly and arrange diagnosis or replacement.");
q("reliability",X,"A clean SMART report guarantees a drive cannot fail soon.",["True","False"],["False"],"SMART does not predict every failure. Continue maintaining backups even when health indicators look normal.","boolean");
q("reliability",A,"Which are useful elements of a backup strategy? Select all that apply.",["More than one copy","A copy isolated from the original system","Testing restoration","Keeping the only copy on the same drive"],["More than one copy","A copy isolated from the original system","Testing restoration"],"Independent copies and verified restores protect against a wider range of failures than a single local copy.","multiple");
q("reliability",X,"What does RAID 0 provide?",["Striping without redundancy","Mirroring with full backup history","Guaranteed recovery after any disk failure","Automatic off-site backups"],["Striping without redundancy"],"RAID 0 stripes data for capacity or throughput but has no redundant copy. Failure of a member can lose the array.");
q("reliability",X,"What does end-to-end supported ECC memory help address?",["Certain memory data errors","Every software bug","Accidental file deletion","A broken fan bearing"],["Certain memory data errors"],"ECC can detect and, within its design limits, correct memory errors. It does not replace backups or protect against all failures.");
q("reliability",A,"Put a cautious drive-replacement workflow in order.",["Back up important data and verify recovery","Power down and disconnect the system safely","Replace the drive using the service instructions","Restore or install the system and verify the data"],["Back up important data and verify recovery","Power down and disconnect the system safely","Replace the drive using the service instructions","Restore or install the system and verify the data"],"Protect and verify data before changing hardware. After replacement, check both system operation and restored files.","order");

export const QUESTIONS: readonly Question[] = bank;
export const FORMAT_LABELS: Record<Format,string> = { single:"Choose one", multiple:"Select all that apply", boolean:"True or false", match:"Match the pairs", order:"Arrange in order", visual:"Identify the component" };
export function grade(question: Question, answer: string[]): boolean {
  if (answer.length !== question.answer.length) return false;
  if (question.format === "multiple") return new Set(answer).size === answer.length && question.answer.every(item => answer.includes(item));
  return question.answer.every((item,index) => answer[index] === item);
}
export function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i=copy.length-1; i>0; i--) { const j=Math.floor(Math.random()*(i+1)); [copy[i],copy[j]]=[copy[j],copy[i]]; }
  return copy;
}
export function makeSession(pool: readonly Question[], count: number): Question[] {
  // Interleave shuffled formats so shorter sessions still offer varied tasks.
  const groups = shuffle(Object.keys(FORMAT_LABELS) as Format[]).map(format => shuffle(pool.filter(q=>q.format===format)));
  const selected: Question[] = [];
  while (selected.length < Math.min(count,pool.length)) {
    for (const group of groups) { const next=group.pop(); if(next && selected.length<count) selected.push(next); }
  }
  return shuffle(selected).map(q=>({...q, options:q.format==="visual"||q.format==="boolean" ? [...q.options] : shuffle(q.options)}));
}
