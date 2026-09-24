"use client";

import { useEffect, useRef, useState } from "react";
import { FaApple, FaWindows, FaLinux } from "react-icons/fa";
import { Check, Copy, Download, ChevronDown, ChevronUp } from "lucide-react";
import Button from "@/components/ui/Button";

type Method = "cargo" | "homebrew" | "shell" | "powershell";
type OS = "macos" | "windows" | "linux";

const RELEASES_BASE = "https://github.com/bhavv04/funes/releases/latest/download";

const OS_OPTIONS: {
	value: OS;
	label: string;
	icon: typeof FaApple;
	variants: { value: string; label: string; asset: string }[];
}[] = [
	{
		value: "macos",
		label: "macOS",
		icon: FaApple,
		variants: [
			{ value: "arm64", label: "Apple Silicon", asset: "funes-memory-aarch64-apple-darwin.tar.xz" },
			{ value: "x64", label: "Intel", asset: "funes-memory-x86_64-apple-darwin.tar.xz" },
		],
	},
	{
		value: "windows",
		label: "Windows",
		icon: FaWindows,
		variants: [
			{ value: "msi", label: ".msi installer", asset: "funes-memory-x86_64-pc-windows-msvc.msi" },
			{ value: "zip", label: ".zip archive", asset: "funes-memory-x86_64-pc-windows-msvc.zip" },
		],
	},
	{
		value: "linux",
		label: "Linux",
		icon: FaLinux,
		variants: [
			{ value: "x64", label: "x64", asset: "funes-memory-x86_64-unknown-linux-gnu.tar.xz" },
			{ value: "arm64", label: "ARM64", asset: "funes-memory-aarch64-unknown-linux-gnu.tar.xz" },
		],
	},
];

const METHODS: { value: Method; label: string; command: string; requiresRust: boolean }[] = [
	{ value: "cargo", label: "Cargo", command: "cargo install funes-memory", requiresRust: true },
	{ value: "homebrew", label: "Homebrew", command: "brew install bhavv04/tap/funes-memory", requiresRust: false },
	{
		value: "shell",
		label: "Shell script",
		command:
			"curl --proto '=https' --tlsv1.2 -LsSf https://github.com/bhavv04/funes/releases/latest/download/funes-memory-installer.sh | sh",
		requiresRust: false,
	},
	{
		value: "powershell",
		label: "PowerShell",
		command:
			'powershell -ExecutionPolicy Bypass -c "irm https://github.com/bhavv04/funes/releases/latest/download/funes-memory-installer.ps1 | iex"',
		requiresRust: false,
	},
];

function detectOs(): OS {
	if (typeof navigator === "undefined") return "macos";
	const ua = navigator.userAgent;
	if (/Win/.test(ua)) return "windows";
	if (/Linux/.test(ua)) return "linux";
	return "macos";
}

export default function GettingStartedPage() {
	const [detected, setDetected] = useState<OS | null>(null);
	const [os, setOs] = useState<OS>("macos");
	const [variant, setVariant] = useState(OS_OPTIONS[0].variants[0].value);
	const [platformOpen, setPlatformOpen] = useState(false);
	const [osMenuOpen, setOsMenuOpen] = useState(false);
	const [method, setMethod] = useState<Method>("cargo");
	const [copied, setCopied] = useState(false);

	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const found = detectOs();
		setDetected(found);
		setOs(found);
	}, []);

	useEffect(() => {
		const onClickOutside = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOsMenuOpen(false);
		};
		document.addEventListener("mousedown", onClickOutside);
		return () => document.removeEventListener("mousedown", onClickOutside);
	}, []);

	const selectedOs = OS_OPTIONS.find((o) => o.value === os)!;
	const selectedVariant = selectedOs.variants.find((v) => v.value === variant) ?? selectedOs.variants[0];
	const selectedMethod = METHODS.find((m) => m.value === method)!;

	const handleSelectOs = (next: OS) => {
		setOs(next);
		setVariant(OS_OPTIONS.find((o) => o.value === next)!.variants[0].value);
		setOsMenuOpen(false);
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(selectedMethod.command);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold tracking-tight mb-3">getting started</h1>
				<p className="text-[hsl(var(--muted-foreground))]">get funes running on your machine in under 5 minutes.</p>
			</div>

			<div className="space-y-4">
				<h2 className="text-xl font-bold">prerequisites</h2>
				<p>funes always needs ollama. rust is only required if you install via cargo.</p>

				<div className="space-y-3">
					<div className="border border-[hsl(var(--border))] rounded-lg p-4 space-y-2">
						<p className="font-mono font-bold text-sm">1. ollama</p>
						<p className="text-sm text-[hsl(var(--muted-foreground))]">
							funes uses ollama to run AI models locally. download from{" "}
							<a href="https://ollama.com" className="underline underline-offset-4">
								ollama.com
							</a>{" "}
							then pull the required models:
						</p>
						<div className="bg-[hsl(var(--muted))]/30 rounded px-3 py-2 font-mono text-sm space-y-1">
							<div>
								<span className="text-green-500">$</span> ollama pull nomic-embed-text
							</div>
							<div>
								<span className="text-green-500">$</span> ollama pull llama3
							</div>
						</div>
					</div>

					<div className="border border-[hsl(var(--border))] rounded-lg p-4 space-y-2">
						<p className="font-mono font-bold text-sm">2. rust — cargo install only</p>
						<p className="text-sm text-[hsl(var(--muted-foreground))]">
							skip this if you&apos;re downloading a prebuilt binary or using homebrew. only needed for{" "}
							<span className="font-mono">cargo install</span> below.
						</p>
						<div className="bg-[hsl(var(--muted))]/30 rounded px-3 py-2 font-mono text-sm">
							<span className="text-green-500">$</span> curl --proto &apos;=https&apos; --tlsv1.2 -sSf https://sh.rustup.rs | sh
						</div>
						<p className="text-xs text-[hsl(var(--muted-foreground))]">
							on Windows, download from{" "}
							<a href="https://rustup.rs" className="underline underline-offset-4">
								rustup.rs
							</a>
						</p>
					</div>
				</div>
			</div>

			<div className="space-y-4">
				<h2 className="text-xl font-bold">install funes</h2>

				{/* primary download */}
				<a
					href={`${RELEASES_BASE}/${selectedVariant.asset}`}
					className="flex items-center justify-between gap-4 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--foreground))] px-4 py-3.5 text-[hsl(var(--background))] transition-opacity hover:opacity-90"
				>
					<span className="flex items-center gap-3">
						<selectedOs.icon size={18} />
						<span className="flex flex-col leading-tight">
							<span className="text-sm font-medium">
								download for {selectedOs.label}
								{detected === os && (
									<span className="ml-2 rounded-full bg-[hsl(var(--background))]/15 px-2 py-0.5 text-xs font-normal">
										detected
									</span>
								)}
							</span>
							<span className="text-xs opacity-70">{selectedVariant.label}</span>
						</span>
					</span>
					<Download size={17} className="shrink-0" />
				</a>

				<button
					onClick={() => setPlatformOpen((v) => !v)}
					className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]"
				>
					not on {selectedOs.label}? choose a platform
					{platformOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
				</button>

                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                        -- Windows may flag this as unknown publisher —{" "}
                        <a
                            href="https://github.com/bhavv04/funes/releases/latest/download/funes-memory-x86_64-pc-windows-msvc.msi.sha256"
                            className="underline underline-offset-4 hover:text-[hsl(var(--foreground))]"
                        >
                            verify the checksum
                        </a>
                        , then choose &quot;more info&quot; → &quot;run anyway&quot;.
                </p>

				{platformOpen && (
					<div className="flex flex-col gap-3 rounded-lg border border-[hsl(var(--border))] p-4 sm:flex-row sm:items-center">
						<div ref={menuRef} className="relative w-full sm:w-44">
							<button
								onClick={() => setOsMenuOpen((v) => !v)}
								className="flex w-full items-center justify-between gap-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 px-3.5 py-2 text-sm transition-colors hover:bg-[hsl(var(--muted))]/50"
							>
								<span className="flex items-center gap-2.5">
									<selectedOs.icon size={14} className="text-[hsl(var(--muted-foreground))]" />
									{selectedOs.label}
								</span>
								<ChevronDown
									size={13}
									className={`text-[hsl(var(--muted-foreground))] transition-transform ${osMenuOpen ? "rotate-180" : ""}`}
								/>
							</button>

							{osMenuOpen && (
								<div className="absolute top-full left-0 z-10 mt-1.5 w-full overflow-hidden rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] shadow-lg">
									{OS_OPTIONS.map((o) => (
										<button
											key={o.value}
											onClick={() => handleSelectOs(o.value)}
											className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm transition-colors hover:bg-[hsl(var(--muted))]/50 ${
												o.value === os ? "text-[hsl(var(--foreground))]" : "text-[hsl(var(--muted-foreground))]"
											}`}
										>
											<o.icon size={14} />
											{o.label}
											{o.value === os && <Check size={13} className="ml-auto" />}
										</button>
									))}
								</div>
							)}
						</div>

						<div className="inline-flex gap-1 rounded-lg border border-[hsl(var(--border))] p-1">
							{selectedOs.variants.map((v) => (
								<button
									key={v.value}
									onClick={() => setVariant(v.value)}
									className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
										variant === v.value
											? "bg-[hsl(var(--foreground))] text-[hsl(var(--background))]"
											: "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
									}`}
								>
									{v.label}
								</button>
							))}
						</div>
					</div>
				)}

				{/* package managers */}
				<div className="space-y-3 pt-2">
					<p className="text-sm text-[hsl(var(--muted-foreground))]">or install via a package manager</p>

					<div className="inline-flex flex-wrap gap-1 rounded-lg border border-[hsl(var(--border))] p-1">
						{METHODS.map((m) => (
							<button
								key={m.value}
								onClick={() => setMethod(m.value)}
								className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
									method === m.value
										? "bg-[hsl(var(--foreground))] text-[hsl(var(--background))]"
										: "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
								}`}
							>
								{m.label}
							</button>
						))}
					</div>

					<div className="flex items-center justify-between gap-4 bg-[hsl(var(--muted))]/30 rounded-lg px-4 py-3 font-mono text-sm">
						<span className="overflow-x-auto whitespace-nowrap">
							<span className="text-green-500">$</span> {selectedMethod.command}
						</span>
						<button
							onClick={handleCopy}
							className="shrink-0 text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]"
						>
							{copied ? <Check size={15} /> : <Copy size={15} />}
						</button>
					</div>

					{selectedMethod.requiresRust && (
						<p className="text-xs text-[hsl(var(--muted-foreground))]">requires the rust toolchain from step 2 above.</p>
					)}
				</div>

				<p className="text-sm text-[hsl(var(--muted-foreground))]">
					this installs the <span className="font-mono">funes</span> command globally on your machine.
				</p>
			</div>

			<div className="space-y-4">
				<h2 className="text-xl font-bold">start the watcher</h2>
				<p>to have funes automatically index files as you work, add a directory to the watch list and start the daemon:</p>
				<div className="bg-[hsl(var(--muted))]/30 rounded-lg px-4 py-3 font-mono text-sm space-y-1">
					<div>
						<span className="text-green-500">$</span> funes watch ~/projects
					</div>
					<div>
						<span className="text-green-500">$</span> funes start
					</div>
				</div>
				<p className="text-sm text-[hsl(var(--muted-foreground))]">
					note: <span className="font-mono">funes start</span> runs in the foreground in v1.0. true background daemon mode is
					coming in v1.1.
				</p>
			</div>

			<div className="flex gap-3 pt-4">
				<a href="/docs/commands">
					<Button variant="default" size="default">
						commands reference →
					</Button>
				</a>
			</div>
		</div>
	);
}