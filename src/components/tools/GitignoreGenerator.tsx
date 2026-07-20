"use client";
import { useState } from "react";
import CopyButton from "@/components/ui/CopyButton";
import { trackTaskComplete } from "@/lib/trackUsage";

const TEMPLATES: Record<string, string> = {
  "Node.js": `# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.npm
.yarn-integrity
.env
.env.local
.env.*.local
dist/
build/
coverage/`,
  "Python": `# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
dist/
*.egg-info/
.eggs/
.env
venv/
env/
.venv/
*.pyc
.pytest_cache/
.mypy_cache/`,
  "React": `# React
node_modules/
build/
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*`,
  "Next.js": `# Next.js
node_modules/
.next/
out/
build/
.env*.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.vercel`,
  "macOS": `# macOS
.DS_Store
.AppleDouble
.LSOverride
Icon
._*
.DocumentRevisions-V100
.fseventsd
.Spotlight-V100
.TemporaryItems
.Trashes
.VolumeIcon.icns
.com.apple.timemachine.donotpresent`,
  "Windows": `# Windows
Thumbs.db
Thumbs.db:encryptable
ehthumbs.db
ehthumbs_vista.db
*.stackdump
[Dd]esktop.ini
$RECYCLE.BIN/
*.cab
*.msi
*.msix
*.msm
*.msp
*.lnk`,
  "Linux": `# Linux
*~
.fuse_hidden*
.directory
.Trash-*
.nfs*`,
  "VS Code": `# VS Code
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
!.vscode/*.code-snippets
.history/
*.vsix`,
  "JetBrains": `# JetBrains IDEs
.idea/
*.iws
*.iml
*.ipr
out/
.idea_modules/`,
  "Java": `# Java
*.class
*.log
*.ctxt
.mtj.tmp/
*.jar
*.war
*.nar
*.ear
*.zip
*.tar.gz
*.rar
hs_err_pid*
replay_pid*`,
  "Go": `# Go
*.exe
*.exe~
*.dll
*.so
*.dylib
*.test
*.out
go.work`,
  "Rust": `# Rust
debug/
target/
Cargo.lock
**/*.rs.bk
*.pdb`,
  "Docker": `# Docker
.dockerignore
docker-compose.override.yml`,
  "Terraform": `# Terraform
.terraform/
*.tfstate
*.tfstate.*
crash.log
crash.*.log
*.tfvars
*.tfvars.json
override.tf
override.tf.json
*_override.tf
*_override.tf.json
.terraformrc
terraform.rc`,
  "Laravel": `# Laravel
/vendor/
/node_modules/
/public/hot
/public/storage
/storage/*.key
.env
.env.backup
.phpunit.result.cache
Homestead.json
Homestead.yaml
auth.json
npm-debug.log
yarn-error.log`,
};

const CATEGORIES = [
  { label: "Languages", items: ["Node.js", "Python", "Java", "Go", "Rust"] },
  { label: "Frameworks", items: ["React", "Next.js", "Laravel"] },
  { label: "OS / IDE", items: ["macOS", "Windows", "Linux", "VS Code", "JetBrains"] },
  { label: "DevOps", items: ["Docker", "Terraform"] },
];

export default function GitignoreGenerator() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [startTime] = useState(Date.now());

  function toggle(name: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }

  const output = Array.from(selected).map(name => TEMPLATES[name]).join("\n\n");

  const allItems = Object.keys(TEMPLATES);
  const filtered = search ? allItems.filter(n => n.toLowerCase().includes(search.toLowerCase())) : null;

  return (
    <div className="space-y-5">
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search stacks (Node.js, Python, macOS…)"
        className="w-full text-sm border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-brand-400"
      />

      {filtered ? (
        <div className="flex flex-wrap gap-2">
          {filtered.map(name => (
            <button key={name} onClick={() => toggle(name)}
              className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${selected.has(name) ? "bg-[var(--brand)] text-white border-[var(--brand)]" : "border-[var(--border)] text-[var(--text)] hover:border-brand-400"}`}>
              {name}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {CATEGORIES.map(cat => (
            <div key={cat.label}>
              <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">{cat.label}</p>
              <div className="flex flex-wrap gap-2">
                {cat.items.map(name => (
                  <button key={name} onClick={() => toggle(name)}
                    className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${selected.has(name) ? "bg-[var(--brand)] text-white border-[var(--brand)]" : "border-[var(--border)] text-[var(--text)] hover:border-brand-400"}`}>
                    {name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected.size > 0 && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-medium text-[var(--text-muted)]">Generated .gitignore ({Array.from(selected).join(", ")})</label>
            <div onClick={() => trackTaskComplete("gitignore-generator", startTime)}><CopyButton text={output} /></div>
          </div>
          <textarea className="textarea min-h-[300px] font-mono text-sm" value={output} readOnly />
        </div>
      )}
      {selected.size === 0 && <p className="text-sm text-[var(--text-muted)] text-center py-4">Select one or more stacks above to generate your .gitignore.</p>}
    </div>
  );
}
