import type { Feature } from './feature'
import type { ScenarioOutline } from './scenario'
import type { Step } from './step'

export type StepType = {
    type: string
    details: string
    docStrings: string | null
    dataTables: {
        [key: string]: string
    }[]
}

export type BackgroundType = {
    tags: string[]
    steps: StepType[]
}

export type ScenarioType = {
    description: string
    tags: string[]
    steps: StepType[]
}

export type ScenarioOutlineType = ScenarioType & {
    examples: {
        [key: string]: any
    }[]
}

export type RuleType = {
    name: string
    description: string
    tags: string[]
    background: BackgroundType | null
    scenarii: (ScenarioType | ScenarioOutlineType)[]
}

export type FeatureType = {
    name: string
    description: string
    tags: string[]
    background: BackgroundType | null
    scenarii: (ScenarioType | ScenarioOutlineType)[]
    rules: RuleType[]
}

function serializeStep(step: Step): StepType {
    return {
        type: step.type,
        details: step.details,
        docStrings: step.docStrings,
        dataTables: step.dataTables,
    }
}

function serializeScenario(scenario: {
    description: string
    tags: Set<string>
    steps: Readonly<Step[]>
}): ScenarioType | ScenarioOutlineType {
    const base: ScenarioType = {
        description: scenario.description,
        tags: [
            ...scenario.tags,
        ],
        steps: [
            ...scenario.steps,
        ].map(serializeStep),
    }

    if ('examples' in scenario) {
        return {
            ...base,
            examples: (scenario as ScenarioOutline).examples,
        }
    }

    return base
}

export function serializeFeature(feature: Feature): FeatureType {
    return {
        name: feature.name,
        description: feature.description,
        tags: [
            ...feature.tags,
        ],
        background: feature.background
            ? {
                  tags: [
                      ...feature.background.tags,
                  ],
                  steps: [
                      ...feature.background.steps,
                  ].map(serializeStep),
              }
            : null,
        scenarii: [
            ...feature.scenarii,
        ].map(serializeScenario),
        rules: [
            ...feature.rules,
        ].map((rule) => ({
            name: rule.name,
            description: rule.description,
            tags: [
                ...rule.tags,
            ],
            background: rule.background
                ? {
                      tags: [
                          ...rule.background.tags,
                      ],
                      steps: [
                          ...rule.background.steps,
                      ].map(serializeStep),
                  }
                : null,
            scenarii: [
                ...rule.scenarii,
            ].map(serializeScenario),
        })),
    }
}
