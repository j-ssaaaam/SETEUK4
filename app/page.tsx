"use client";

import { useEffect, useMemo, useState } from "react";

type Subject = "국어" | "수학" | "과학" | "영어" | "사회";

type Result = {
  subject: Subject;
  title: string;
  draft: string;
  tags: string[];
};

type SavedDraft = {
  id: string;
  student: string;
  grade: string;
  semester: string;
  createdAt: string;
  results: Result[];
};

const subjects: Subject[] = ["국어", "수학", "과학", "영어", "사회"];
const initialKeywords = "기후 변화 데이터를 분석하고, 교내 탄소중립 캠페인을 기획함";

const demoResults: Result[] = [
  {
    subject: "과학",
    title: "기후 데이터 분석과 탄소중립 캠페인",
    draft:
      "기후 변화에 관한 국내외 자료를 비교·분석하여 지역별 평균기온 변화와 생활 속 탄소 배출의 관계를 탐구함. 분석 결과를 바탕으로 교내 탄소중립 실천 캠페인을 기획하고, 학급 구성원의 참여를 이끌어내는 과정에서 자료를 근거로 문제를 정의하고 해결 방안을 구체화하는 태도가 돋보임.",
    tags: ["자료 분석", "문제 해결", "협업"],
  },
  {
    subject: "수학",
    title: "통계로 읽는 생활 속 환경 문제",
    draft:
      "실제 측정 자료를 산점도와 회귀식으로 표현하고 상관관계의 의미를 해석함. 통계적 결과를 그대로 받아들이지 않고 표본의 한계와 변인의 영향을 점검하며, 수학적 개념을 사회 현상을 설명하는 언어로 확장하여 활용함.",
    tags: ["통계적 사고", "논리적 추론"],
  },
  {
    subject: "국어",
    title: "근거를 갖춘 캠페인 제안서 작성",
    draft:
      "기후 위기 관련 자료의 핵심 내용을 선별하고 독자의 관점을 고려하여 설득력 있는 캠페인 제안서를 작성함. 주장과 근거의 관계를 명확히 구성하고, 동료 피드백을 반영하여 표현을 다듬는 등 목적에 맞게 글을 고쳐 쓰는 역량을 보여줌.",
    tags: ["비판적 읽기", "의사소통"],
  },
];

const agentSteps = [
  { key: "collect", label: "수집 에이전트", detail: "활동 키워드와 관찰 내용 정리" },
  { key: "write", label: "작성 에이전트", detail: "과목별 세특 문구 초안 작성" },
  { key: "review", label: "검토 에이전트", detail: "금지어·표현 규정 점검 및 다듬기" },
];

export default function Home() {
  const [student, setStudent] = useState("김민서");
  const [grade, setGrade] = useState("2학년");
  const [semester, setSemester] = useState("1학기");
  const [keywords, setKeywords] = useState(initialKeywords);
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>(["과학", "수학", "국어"]);
  const [model, setModel] = useState("Gemini 3.5 Flash-Lite");
  const [activeStep, setActiveStep] = useState("collect");
  const [generated, setGenerated] = useState(false);
  const [activeSubject, setActiveSubject] = useState<Subject>("과학");
  const [results, setResults] = useState<Result[]>(demoResults);
  const [saved, setSaved] = useState<SavedDraft[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem("setukit-drafts");
    if (stored) setSaved(JSON.parse(stored));
  }, []);

  const activeResult = useMemo(
    () => results.find((result) => result.subject === activeSubject) ?? results[0],
    [activeSubject, results],
  );

  const toggleSubject = (subject: Subject) => {
    setSelectedSubjects((current) =>
      current.includes(subject) ? current.filter((item) => item !== subject) : [...current, subject],
    );
  };

  const generate = () => {
    setGenerated(false);
    setActiveStep("collect");
    window.setTimeout(() => setActiveStep("write"), 650);
    window.setTimeout(() => setActiveStep("review"), 1300);
    window.setTimeout(() => {
      const source = keywords.trim() || initialKeywords;
      const next = selectedSubjects.map((subject, index) => ({
        subject,
        title: `${source.split(" ")[0]} 활동과 ${subject} 교과 역량`,
        draft:
          `${source} 활동에서 ${subject} 교과의 핵심 개념을 실제 문제에 적용하고, 관련 자료를 비교하며 자신의 생각을 구체화함. 탐구 과정에서 관찰한 내용을 근거와 함께 정리하고 동료의 의견을 반영하여 결과물을 개선하는 등 자기주도적으로 학습을 확장하는 태도가 돋보임.`,
        tags: index % 2 === 0 ? ["자기주도성", "자료 활용", "협업"] : ["탐구 태도", "논리적 표현"],
      }));
      setResults(next.length ? next : demoResults);
      setActiveSubject(next[0]?.subject ?? "과학");
      setGenerated(true);
      setToast("과목별 세특 초안이 완성되었습니다.");
      window.setTimeout(() => setToast(""), 2600);
    }, 1950);
  };

  const saveDraft = () => {
    const item: SavedDraft = {
      id: crypto.randomUUID(),
      student,
      grade,
      semester,
      createdAt: new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeStyle: "short" }).format(new Date()),
      results,
    };
    const next = [item, ...saved];
    setSaved(next);
    window.localStorage.setItem("setukit-drafts", JSON.stringify(next));
    setToast("현재 결과를 저장했습니다.");
    window.setTimeout(() => setToast(""), 2600);
  };

  const loadDraft = (item: SavedDraft) => {
    setStudent(item.student);
    setGrade(item.grade);
    setSemester(item.semester);
    setResults(item.results);
    setActiveSubject(item.results[0]?.subject ?? "과학");
    setGenerated(true);
    setShowHistory(false);
    setToast("저장된 초안을 불러왔습니다.");
    window.setTimeout(() => setToast(""), 2600);
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="세특랩 홈">
          <span className="brand-mark">S</span>
          <span>세특<span className="brand-accent">랩</span></span>
        </a>
        <div className="topbar-actions">
          <span className="status-dot"><span /> Supabase 연결됨</span>
          <button className="history-button" onClick={() => setShowHistory(true)}><span>↺</span> 저장 내역</button>
          <div className="avatar">교</div>
        </div>
      </header>

      <div className="content-wrap" id="top">
        <section className="hero">
          <div>
            <p className="eyebrow">AI AGENT WORKSPACE <span>●</span></p>
            <h1>학생의 성장을 기록하는<br /><em>세특 초안</em>을 만들어보세요.</h1>
            <p className="hero-copy">활동 키워드만 입력하면, 수집·작성·검토 에이전트가<br className="desktop-only" /> 과목별로 자연스럽고 구체적인 문장을 제안해드려요.</p>
          </div>
          <div className="hero-art" aria-hidden="true"><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="art-core">✦</div><div className="art-dot dot-one" /><div className="art-dot dot-two" /></div>
        </section>

        <section className="workspace-grid">
          <div className="left-column">
            <section className="card input-card">
              <div className="card-heading"><div><p className="section-kicker">STEP 01</p><h2>학생 정보와 활동 입력</h2></div><span className="heading-icon">✎</span></div>
              <div className="form-grid">
                <label>학생 이름<input value={student} onChange={(event) => setStudent(event.target.value)} /></label>
                <label>학년·학기<div className="select-row"><select value={grade} onChange={(event) => setGrade(event.target.value)}><option>1학년</option><option>2학년</option><option>3학년</option></select><select value={semester} onChange={(event) => setSemester(event.target.value)}><option>1학기</option><option>2학기</option></select></div></label>
              </div>
              <label className="textarea-label">활동 키워드 또는 관찰 내용<textarea value={keywords} onChange={(event) => setKeywords(event.target.value)} rows={4} placeholder="학생의 활동, 관찰 내용, 성장한 점을 자유롭게 입력하세요." /><span className="counter">{keywords.length} / 500</span></label>
              <div className="quick-tags"><span>빠른 입력</span><button onClick={() => setKeywords(initialKeywords)}># 데이터 분석</button><button onClick={() => setKeywords("팀원들과 역할을 나누어 문제를 해결하고 발표함")}># 협업과 발표</button><button onClick={() => setKeywords("관심 주제를 스스로 정하고 관련 자료를 찾아 탐구함")}># 자기주도 탐구</button></div>
              <div className="subject-picker"><span>적용할 과목</span><div className="subject-chips">{subjects.map((subject) => <button key={subject} className={selectedSubjects.includes(subject) ? "subject-chip selected" : "subject-chip"} onClick={() => toggleSubject(subject)} aria-pressed={selectedSubjects.includes(subject)}>{selectedSubjects.includes(subject) && <span>✓</span>}{subject}</button>)}</div></div>
              <div className="form-footer"><label className="model-label">사용 모델<select value={model} onChange={(event) => setModel(event.target.value)}><option>Gemini 3.5 Flash-Lite</option><option>Gemini 3.5 Pro</option></select></label><button className="generate-button" onClick={generate}><span>✦</span> 세특 초안 생성하기</button></div>
            </section>

            <section className="card pipeline-card">
              <div className="pipeline-header"><div><p className="section-kicker">STEP 02</p><h2>에이전트 팀이 작업 중이에요</h2></div><span className="live-pill"><span /> LIVE</span></div>
              <div className="agent-list">{agentSteps.map((step, index) => { const active = activeStep === step.key; const complete = ["write", "review"].includes(activeStep) && index === 0 || activeStep === "review" && index === 1 || generated && index === 2; return <div className={active ? "agent-row active" : "agent-row"} key={step.key}><div className="agent-badge">{complete ? "✓" : index === 0 ? "⌁" : index === 1 ? "✎" : "⌁"}</div><div className="agent-info"><strong>{step.label}</strong><span>{active ? "작업 중..." : complete ? "완료" : step.detail}</span></div><span className={active ? "agent-state working" : complete ? "agent-state" : "agent-state muted"}>{active ? "진행 중" : complete ? "완료" : "대기"}</span></div>; })}</div>
              <div className="pipeline-note"><span>✦</span><p><strong>검토 에이전트가 문장을 다듬고 있어요.</strong><br />금지어와 단정적인 표현을 점검하고 학생의 성장 과정이 잘 드러나도록 정리합니다.</p></div>
            </section>
          </div>

          <section className="card result-card">
            <div className="result-heading"><div><p className="section-kicker">STEP 03</p><h2>과목별 세특 초안</h2></div><span className="result-count">{results.length}개 과목</span></div>
            <div className="result-tabs">{(selectedSubjects.length ? selectedSubjects : subjects.slice(0, 3)).map((subject) => <button key={subject} className={activeSubject === subject ? "result-tab active" : "result-tab"} onClick={() => setActiveSubject(subject)}>{subject}</button>)}</div>
            {activeResult ? <div className="draft-body"><div className="draft-meta"><span className="subject-label">{activeResult.subject}</span><span className="draft-ready">{generated ? "검토 완료" : "예시 초안"} <span>✓</span></span></div><h3>{activeResult.title}</h3><p className="draft-text">{activeResult.draft}</p><div className="tag-row">{activeResult.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div><div className="draft-actions"><button className="copy-button" onClick={() => navigator.clipboard?.writeText(activeResult.draft).then(() => { setToast("문장을 클립보드에 복사했습니다."); window.setTimeout(() => setToast(""), 2200); })}>▣ 문장 복사</button><button className="save-button" onClick={saveDraft}>저장하기 <span>→</span></button></div></div> : <div className="empty-state">과목을 선택하고 초안을 생성해보세요.</div>}
            <div className="result-footnote"><span>ⓘ</span> AI가 만든 초안은 선생님의 검토와 수정을 거쳐 최종 기록으로 활용해주세요.</div>
          </section>
        </section>
        <footer><span>세특랩</span> · 학생의 성장을 더 정확하게 기록하는 방법 <span className="footer-right">{model} 사용 중 · 개인정보는 안전하게 보호됩니다</span></footer>
      </div>

      {showHistory && <div className="modal-backdrop" onClick={() => setShowHistory(false)}><section className="history-modal" onClick={(event) => event.stopPropagation()}><div className="modal-heading"><div><p className="section-kicker">SUPABASE HISTORY</p><h2>저장 내역</h2></div><button onClick={() => setShowHistory(false)} aria-label="닫기">×</button></div>{saved.length ? <div className="history-list">{saved.map((item) => <button className="history-item" key={item.id} onClick={() => loadDraft(item)}><span className="history-avatar">{item.student.slice(0, 1)}</span><span><strong>{item.student} · {item.grade} {item.semester}</strong><small>{item.createdAt} · {item.results.length}개 과목</small></span><span>→</span></button>)}</div> : <div className="empty-history">아직 저장된 초안이 없습니다.<br />완성된 결과를 저장하면 여기에 표시됩니다.</div>}</section></div>}
      {toast && <div className="toast"><span>✓</span>{toast}</div>}
    </main>
  );
}
