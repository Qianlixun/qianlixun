import base64, json, os, subprocess, urllib.request
REPO = "Qianlixun/qianlixun"; API = "https://api.github.com"
CWD = os.path.dirname(os.path.abspath(__file__)); TOKEN = os.environ["GITHUB_TOKEN"]
def api(method, path, data=None):
    req = urllib.request.Request(API+path, method=method, data=json.dumps(data).encode() if data is not None else None,
        headers={"Authorization": f"Bearer {TOKEN}", "Accept": "application/vnd.github+json", "User-Agent": "api"})
    try:
        with urllib.request.urlopen(req) as r: return json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e: print(f"HTTP {e.code} @ {path}: {e.read().decode()[:120]}"); raise
def git(*a): return subprocess.run(["git", *a], capture_output=True, cwd=CWD, check=True).stdout
def push(branch, parent, msg):
    print(f"[{branch}] ...")
    t = api("GET", f"/repos/{REPO}/git/trees/{parent}?recursive=1")["tree"]
    rmap = {e["path"]: e for e in t if e["type"]=="blob"}
    entries = []
    out = git("ls-tree","-rz","0fa538a").decode("utf-8","surrogateescape")
    for rec in out.split("\0"):
        if not rec: continue
        meta, path = rec.split("\t",1); mode, typ, sha = meta.split()
        if typ != "blob": continue
        if path in rmap and rmap[path]["sha"]==sha:
            entries.append({"path":path,"mode":mode,"type":"blob","sha":sha}); continue
        raw = git("show", f"0fa538a:{path}")
        if b"\0" in raw:
            b = api("POST", f"/repos/{REPO}/git/blobs", {"content":base64.b64encode(raw).decode(),"encoding":"base64"})
            entries.append({"path":path,"mode":mode,"type":"blob","sha":b["sha"]})
        else:
            entries.append({"path":path,"mode":mode,"type":"blob","content":raw.decode("utf-8","surrogateescape")})
    tree = api("POST", f"/repos/{REPO}/git/trees", {"tree":entries})
    commit = api("POST", f"/repos/{REPO}/git/commits", {"message":msg,"tree":tree["sha"],"parents":[parent]})
    api("PATCH", f"/repos/{REPO}/git/refs/heads/{branch}", {"sha":commit["sha"]})
    print(f"[{branch}] DONE {commit['sha'][:12]}")
for b in ["master","vue3-migration"]:
    sha = api("GET", f"/repos/{REPO}/git/refs/heads/{b}")["object"]["sha"]
    push(b, sha, "移除 GraphQL 依赖（REST 计数）；修复 formatCategory 与标签空态")
print("ALL DONE")
