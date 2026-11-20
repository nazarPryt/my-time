// Every stylesheet the remote renders with, joined into one string that
// mount.ts injects into the shadow root. SFC <style> blocks are not used:
// Vite would inject them into the host's <head>, outside the shadow root.
// Each mode keeps its CSS next to its components; register new files here.
import appRoot from './app/app-root.css?inline'
import hub from './hub/hub.css?inline'
import levelQuiz from './modes/level-quiz/level-quiz.css?inline'
import practice from './modes/sentence-builder/components/practice/practice.css?inline'
import rule from './modes/sentence-builder/components/rule/rule.css?inline'
import topicList from './modes/sentence-builder/components/topic-list/topic-list.css?inline'
import sentenceBuilder from './modes/sentence-builder/sentence-builder.css?inline'
import base from './shared/styles/base.css?inline'
import skeleton from './shared/ui/skeleton.css?inline'

export const styles = [
	base,
	skeleton,
	appRoot,
	hub,
	levelQuiz,
	sentenceBuilder,
	topicList,
	practice,
	rule,
].join('\n')
