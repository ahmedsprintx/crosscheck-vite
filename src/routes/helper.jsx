import Home from 'pages/home';

import Layout from 'components/layout';
import QaTesting from 'pages/qa-testing';
import StartTesting from 'pages/start-testing';

import Activities from 'pages/activities';
import BugReports from 'pages/bug-reports';

import UserManagement from 'pages/user-management';
import TestCases from 'pages/test-cases';

import ForgotPassword from 'pages/forgot-password';
import Login from 'pages/login';
import ResetPassword from 'pages/reset-password';
import Projects from 'pages/projects';
import SingleProject from 'pages/projects/single-project';
import AddTestCaseData from 'pages/test-cases/add-test-case';
import TestRuns from 'pages/test-runs';
import TestRun from 'pages/test-runs/single-test-run';
import Components from 'pages/components-page/components';
import AccountSetting from 'pages/account-settings';
import Trash from 'pages/trash';
import VerifyEmail from 'pages/verify-email';
import Shortcuts from 'pages/shortcuts';
import SignUp from 'pages/sign-up';
import VerifySignUpEmail from 'pages/sign-up/verify-email';
import WelcomePage from 'pages/welcome-page';
import OnBoarding from 'pages/on-boarding';
import JoinWorkspace from 'pages/join-workspace';
import RejectWorkspace from 'pages/reject-workspace';
import Billing from 'pages/billing';
import LoadingPage from 'pages/loading';
import WorkspaceSetting from 'pages/workspace-settings';
import IntegrationPage from 'pages/integration-page';
import Captures from 'pages/captures';
import CaptureSingle from 'pages/captures/view-capture';

export const publicRoute = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/sign-up/',
    element: <SignUp />,
  },
  {
    path: '/verify-email/:email',
    element: <VerifySignUpEmail />,
  },
  {
    path: '/welcome/:email',
    element: <WelcomePage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/join-workspace',
    element: <JoinWorkspace />,
  },
  {
    path: '/reject-workspace',
    element: <RejectWorkspace />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
  {
    path: '/verifyEmail/:id',
    element: <VerifyEmail />,
  },
  {
    path: '/bug-report/:id',
    element: <BugReports />,
  },
  {
    path: '/captures/:id',
    element: <CaptureSingle />,
  },
  {
    path: '*',
    element: <Login />,
  },
];

export const routes = (role, activePlan) => [
  {
    path: '*',
    element: (
      <Layout allowedRoles={['Admin', 'QA', 'Developer', 'Project Manager']} currentRole={role}>
        <Home />
      </Layout>
    ),
  },
  {
    path: '/components-page',
    element: (
      <Layout allowedRoles={['Admin', 'QA', 'Developer', 'Project Manager', null]} currentRole={role}>
        <Components />{' '}
      </Layout>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <Layout allowedRoles={['Admin', 'QA', 'Developer', 'Project Manager', null]} currentRole={role}>
        <Home />
      </Layout>
    ),
  },
  {
    path: '/captures',
    element: (
      <Layout allowedRoles={['Admin', 'QA', 'Developer', 'Project Manager', null]} currentRole={role}>
        <Captures />
      </Layout>
    ),
  },
  {
    path: '/captures/:id',
    element: (
      <Layout allowedRoles={['Admin', 'QA', 'Developer', 'Project Manager', null]} currentRole={role}>
        <CaptureSingle />
      </Layout>
    ),
  },

  {
    path: '/qa-testing',
    element: (
      <Layout allowedRoles={['Admin', 'QA', 'Developer', 'Project Manager']} currentRole={role}>
        <QaTesting />
      </Layout>
    ),
  },
  {
    path: '/join-workspace',
    element: (
      <Layout allowedRoles={['Admin', 'QA', 'Developer', 'Project Manager', null]} currentRole={role}>
        <JoinWorkspace />
      </Layout>
    ),
  },
  {
    path: '/billing',
    element: (
      <Layout allowedRoles={['Admin', 'QA', 'Developer', 'Project Manager', 'Developer']} currentRole={role}>
        <Billing />
      </Layout>
    ),
  },
  {
    path: '/loading',
    element: (
      <Layout allowedRoles={['Admin', 'QA', 'Developer', 'Project Manager', 'Developer']} currentRole={role}>
        <LoadingPage />
      </Layout>
    ),
  },
  {
    path: '/bug-testing',
    element: (
      <Layout allowedRoles={['Admin', 'QA', 'Developer', 'Project Manager']} currentRole={role}>
        <StartTesting />
      </Layout>
    ),
  },
  {
    path: '/on-boarding/:email',
    element: <OnBoarding />,
  },
  {
    path: '/activities',
    element: (
      <Layout
        locked={activePlan === 'Free'}
        allowedRoles={['Admin', 'Project Manager', 'QA', 'Developer']}
        currentRole={role}
      >
        <Activities />
      </Layout>
    ),
  },
  {
    path: '/test-cases',
    element: (
      <Layout allowedRoles={['Admin', 'QA', 'Project Manager', 'Developer']} currentRole={role}>
        <TestCases />
      </Layout>
    ),
  },
  {
    path: '/test-cases/add',
    element: (
      <Layout allowedRoles={['Admin', 'QA', 'Project Manager']} currentRole={role}>
        <AddTestCaseData />
      </Layout>
    ),
  },

  {
    path: '/test-run',
    element: (
      <Layout allowedRoles={['Admin', 'QA', 'Developer', 'Project Manager']} currentRole={role}>
        <TestRuns />
      </Layout>
    ),
  },
  {
    path: '/test-run/:id',
    element: (
      <Layout allowedRoles={['Admin', 'QA', 'Developer', 'Project Manager']} currentRole={role}>
        <TestRun />
      </Layout>
    ),
  },
  {
    path: '/user-management',
    element: (
      <Layout
        allowedRoles={['Admin', 'Project Manager']} // NOTE: 'QA', 'Developer',
        currentRole={role}
      >
        <UserManagement />
      </Layout>
    ),
  },
  {
    path: '/account-setting',
    element: (
      <Layout allowedRoles={['Admin', 'QA', 'Developer', 'Project Manager', null]} currentRole={role}>
        <AccountSetting />
      </Layout>
    ),
  },
  {
    path: '/workspace-setting',
    element: (
      <Layout allowedRoles={['Admin', 'QA', 'Developer', 'Project Manager']} currentRole={role}>
        <WorkspaceSetting />
      </Layout>
    ),
  },
  {
    path: '/account-setting/:code',
    element: (
      <Layout allowedRoles={['Admin', 'QA', 'Developer', 'Project Manager']} currentRole={role}>
        <AccountSetting />
      </Layout>
    ),
  },

  {
    path: '/trash',
    element: (
      <Layout
        locked={activePlan === 'Free'}
        allowedRoles={['Admin', 'Project Manager', 'QA', 'Developer']}
        currentRole={role}
      >
        <Trash />
      </Layout>
    ),
  },
  {
    path: '/integrations',
    element: (
      <Layout
        locked={activePlan === 'Free'}
        allowedRoles={['Admin', 'QA', 'Developer', 'Project Manager']}
        currentRole={role}
      >
        <IntegrationPage />
      </Layout>
    ),
  },
  {
    path: '/shortcuts',
    element: (
      <Layout allowedRoles={['Admin', 'QA', 'Developer', 'Project Manager', null]} currentRole={role}>
        <Shortcuts />
      </Layout>
    ),
  },
  {
    path: '/projects',
    element: (
      <Layout allowedRoles={['Admin', 'QA', 'Developer', 'Project Manager']} currentRole={role}>
        <Projects />
      </Layout>
    ),
  },

  {
    path: '/projects/:id',
    element: (
      <Layout allowedRoles={['Admin', 'QA', 'Developer', 'Project Manager']} currentRole={role}>
        <SingleProject />
      </Layout>
    ),
  },
];
