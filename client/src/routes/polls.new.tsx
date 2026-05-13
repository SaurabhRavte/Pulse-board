/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
import { useNavigate, createFileRoute } from "@tanstack/react-router";
import {
  CheckCircle2,
  CheckSquare,
  Circle,
  GripVertical,
  Plus,
  Trash2,
} from "lucide-react";
import { api, errorMessage } from "../lib/api";
import { Protected } from "../components/protected";
import { Button } from "../components/button";
import { Input, Label, Textarea } from "../components/input";
import { Card, CardBody, CardHeader, CardTitle } from "../components/card";

type QuestionType = "single" | "multiple";

interface DraftOption {
  id: string;
  label: string;
}
interface DraftQuestion {
  id: string;
  prompt: string;
  isMandatory: boolean;
  type: QuestionType;
  options: DraftOption[];
}

const newId = () => Math.random().toString(36).slice(2, 10);

const blankQuestion = (): DraftQuestion => ({
  id: newId(),
  prompt: "",
  isMandatory: true,
  type: "single",
  options: [
    { id: newId(), label: "" },
    { id: newId(), label: "" },
  ],
});

function ModeToggle({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "h-10 rounded-lg border text-sm font-medium transition-colors " +
        (active
          ? "bg-[rgb(var(--pb-accent))] text-[rgb(var(--pb-accent-fg))] border-[rgb(var(--pb-accent))]"
          : "bg-elev text-fg border-app hover:bg-[rgb(var(--pb-border))]")
      }
    >
      {label}
    </button>
  );
}

function CreatePollInner() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [responseMode, setResponseMode] = useState;
  "anonymous" | ("authenticated" > "anonymous");
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [questions, setQuestions] = useState<DraftQuestion[]>([
    blankQuestion(),
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateQuestion = (id: string, patch: Partial<DraftQuestion>) =>
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, ...patch } : q)));

  const addQuestion = () => setQuestions((qs) => [...qs, blankQuestion()]);

  const removeQuestion = (id: string) =>
    setQuestions((qs) =>
      qs.length === 1 ? qs : qs.filter((q) => q.id !== id),
    );

  const updateOption = (qId: string, oId: string, label: string) =>
    setQuestions((qs) =>
      qs.map((q) =>
        q.id !== qId
          ? q
          : {
              ...q,
              options: q.options.map((o) =>
                o.id === oId ? { ...o, label } : o,
              ),
            },
      ),
    );

  const addOption = (qId: string) =>
    setQuestions((qs) =>
      qs.map((q) =>
        q.id !== qId
          ? q
          : { ...q, options: [...q.options, { id: newId(), label: "" }] },
      ),
    );

  const removeOption = (qId: string, oId: string) =>
    setQuestions((qs) =>
      qs.map((q) =>
        q.id !== qId
          ? q
          : {
              ...q,
              options:
                q.options.length === 2
                  ? q.options
                  : q.options.filter((o) => o.id !== oId),
            },
      ),
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (title.trim().length < 2) {
      setError("Title is required");
      return;
    }
    for (const q of questions) {
      if (q.prompt.trim().length < 1) {
        setError("Every question needs a prompt");
        return;
      }
      const labels = q.options.map((o) => o.label.trim()).filter(Boolean);
      if (labels.length < 2) {
        setError("Every question needs at least 2 non-empty options");
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        responseMode,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        questions: questions.map((q) => ({
          prompt: q.prompt.trim(),
          isMandatory: q.isMandatory,
          type: q.type,
          options: q.options.map((o) => o.label.trim()).filter(Boolean),
        })),
      };
      const res = await api.post<{ data: { id: string } }>(
        "/api/polls",
        payload,
      );
      navigate({
        to: "/polls/$pollId/analytics",
        params: { pollId: res.data.data.id },
      });
    } catch (err) {
      setError(errorMessage(err, "Could not create poll"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <p className="text-xs uppercase tracking-widest text-muted mb-1.5">
        New poll
      </p>
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-fg">
        Build your poll
      </h1>
      <p className="text-sm text-muted mt-2 max-w-xl">
        Add as many questions as you like. Mix single-choice and multi-select.
      </p>

      <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Basics</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                required
                maxLength={200}
                placeholder="Q1 retrospective feedback"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                maxLength={2000}
                placeholder="A quick pulse-check on how the team felt about the last quarter."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Response mode</Label>
                <div className="grid grid-cols-2 gap-2">
                  <ModeToggle
                    label="Anonymous"
                    active={responseMode === "anonymous"}
                    onClick={() => setResponseMode("anonymous")}
                  />
                  <ModeToggle
                    label="Authenticated"
                    active={responseMode === "authenticated"}
                    onClick={() => setResponseMode("authenticated")}
                  />
                </div>
                <p className="text-xs text-muted mt-2">
                  {responseMode === "anonymous"
                    ? "Anyone with the link can respond."
                    : "Respondents must sign in. Each person can only submit once."}
                </p>
              </div>
              <div>
                <Label htmlFor="expiresAt">Expires at (optional)</Label>
                <Input
                  id="expiresAt"
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
                <p className="text-xs text-muted mt-2">
                  Leave blank for no expiry.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="space-y-4">
          {questions.map((q, qIdx) => (
            <Card key={q.id}>
              <CardHeader className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-md bg-app border border-app text-xs text-muted font-mono">
                    {qIdx + 1}
                  </span>
                  <CardTitle>Question {qIdx + 1}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-xs text-muted cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="accent-[rgb(var(--pb-accent))]"
                      checked={q.isMandatory}
                      onChange={(e) =>
                        updateQuestion(q.id, { isMandatory: e.target.checked })
                      }
                    />
                    Required
                  </label>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => removeQuestion(q.id)}
                    disabled={questions.length === 1}
                    aria-label="Remove question"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                <div>
                  <Label htmlFor={`q-${q.id}`}>Prompt</Label>
                  <Input
                    id={`q-${q.id}`}
                    required
                    maxLength={500}
                    placeholder="How did the team feel about delivery in Q1?"
                    value={q.prompt}
                    onChange={(e) =>
                      updateQuestion(q.id, { prompt: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Answer type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <ModeToggle
                      label="Single choice"
                      active={q.type === "single"}
                      onClick={() => updateQuestion(q.id, { type: "single" })}
                    />
                    <ModeToggle
                      label="Multi-select"
                      active={q.type === "multiple"}
                      onClick={() => updateQuestion(q.id, { type: "multiple" })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Options</Label>
                  <div className="space-y-2">
                    {q.options.map((o, oIdx) => (
                      <div key={o.id} className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted" />
                        {q.type === "multiple" ? (
                          <CheckSquare className="h-4 w-4 text-muted" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted" />
                        )}
                        <Input
                          required
                          maxLength={200}
                          placeholder={`Option ${oIdx + 1}`}
                          value={o.label}
                          onChange={(e) =>
                            updateOption(q.id, o.id, e.target.value)
                          }
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeOption(q.id, o.id)}
                          disabled={q.options.length === 2}
                          aria-label="Remove option"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="mt-3"
                    onClick={() => addOption(q.id)}
                    leftIcon={<Plus className="h-3.5 w-3.5" />}
                    disabled={q.options.length >= 10}
                  >
                    Add option
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addQuestion}
            leftIcon={<Plus className="h-4 w-4" />}
            className="w-full"
            disabled={questions.length >= 50}
          >
            Add another question
          </Button>
        </div>

        {error && (
          <p className="text-sm text-[rgb(var(--pb-danger))]">{error}</p>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate({ to: "/dashboard" })}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={submitting}
            leftIcon={<CheckCircle2 className="h-4 w-4" />}
          >
            Create poll
          </Button>
        </div>
      </form>
    </div>
  );
}

function CreatePoll() {
  return (
    <Protected>
      <CreatePollInner />
    </Protected>
  );
}

// @ts-ignore — typed paths come from the auto-generated routeTree.gen.ts
export const Route = createFileRoute("/polls/new")({
  component: CreatePoll,
});
