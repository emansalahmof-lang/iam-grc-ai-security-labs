/**
 * Makes lab components available in every .md/.mdx file without imports.
 */
import MDXComponents from '@theme-original/MDXComponents';
import LabMeta from '@site/src/components/lab/LabMeta';
import LabProgress from '@site/src/components/lab/LabProgress';
import KnowledgeCheck from '@site/src/components/lab/KnowledgeCheck';
import RiskScorer from '@site/src/components/lab/RiskScorer';
import JwtDecoder from '@site/src/components/lab/JwtDecoder';
import SodChecker from '@site/src/components/lab/SodChecker';
import DecisionScenario from '@site/src/components/lab/DecisionScenario';
import MaturityAssessment from '@site/src/components/tools/MaturityAssessment';
import StatusChecklist from '@site/src/components/tools/StatusChecklist';
import TprmQuestionnaire from '@site/src/components/tools/TprmQuestionnaire';
import IncidentClassifier from '@site/src/components/tools/IncidentClassifier';
import AiRiskWorksheet from '@site/src/components/tools/AiRiskWorksheet';
import KpiExplorer from '@site/src/components/tools/KpiExplorer';

export default {
  ...MDXComponents,
  LabMeta,
  LabProgress,
  KnowledgeCheck,
  RiskScorer,
  JwtDecoder,
  SodChecker,
  DecisionScenario,
  MaturityAssessment,
  StatusChecklist,
  TprmQuestionnaire,
  IncidentClassifier,
  AiRiskWorksheet,
  KpiExplorer,
};
