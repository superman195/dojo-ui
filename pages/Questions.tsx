import Footer from '@/components/Common/Footer';
import { ErrorModal } from '@/components/QuestionPageComponents';
import MultiOutputVisualizerLegacy from '@/components/QuestionPageComponents/MultiOutputVisualizerLegacy/MultiOutputVisualizerLegacy';
import MultiOutputVisualizerNew from '@/components/QuestionPageComponents/MultiOutputVisualizerNew/MultiOutputVisualizerNew';
import SingleOutputTaskVisualizer from '@/components/QuestionPageComponents/SingleOutputTask/SingleOutputTaskVisualizer';
import useRequestTaskByTaskID from '@/hooks/useRequestTaskByTaskID';
import Layout from '@/layout';
import { useAuth } from '@/providers/authContext';
import { useSubmit } from '@/providers/submitContext';
import { Task } from '@/types/QuestionPageTypes';
import { TaskPayloadNew } from '@/utils/states';
import { isLegacyTask, isTaskPayloadNew } from '@/utils/typeGuards';
import exp from 'constants';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { useAccount } from 'wagmi';
const Questionsv2 = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { isConnected } = useAccount();
  const {
    getCriterionForResponse: criterionForResponse,
    addCriterionForResponse,
    resetCriterionForResponse,
    resetCriterionForResponseNew,
  } = useSubmit();
  const getTaskIdFromRouter = useCallback(() => {
    if (!router) return '';
    if (typeof router.query.taskId === 'string') return router.query.taskId;
    return '';
  }, [router]);
  const {
    task,
    loading: isTaskLoading,
    error: taskError,
  } = useRequestTaskByTaskID(getTaskIdFromRouter(), isConnected, isAuthenticated);
  useEffect(() => {
    isLegacyTask(task) && resetCriterionForResponse(task as Task); //Putting the reset in this common parent page
    isTaskPayloadNew(task) && resetCriterionForResponseNew(task as TaskPayloadNew); //Putting the reset in this common parent page
  }, [task]);
  const renderTaskVisualizer = () => {
    if (!task || isTaskLoading) return null;

    // Single output task case
    if (isLegacyTask(task) && task.taskData.responses.length === 1) {
      return (
        <div className="flex w-full justify-center px-4">
          <div className="w-full max-w-[1075px]">
            <SingleOutputTaskVisualizer containerClassName="" task={task} />
          </div>
        </div>
      );
    }

    // Multi output task case
    if (isTaskPayloadNew(task)) {
      return <MultiOutputVisualizerNew containerClassName="" task={task} />;
    }

    if (isLegacyTask(task)) {
      return <MultiOutputVisualizerLegacy containerClassName="" task={task} />;
    }

    return null;
  };

  return (
    <Layout isFullWidth={true}>
      <ErrorModal
        open={!!taskError}
        onClose={() => {
          router.push('/task-list');
        }}
        errorMessage={"There's an error with this task."}
      />
      <div className="flex grow justify-center py-8">{renderTaskVisualizer()}</div>
      {!isTaskLoading && task && ((isAuthenticated && isConnected) || exp) && <Footer task={task} />}
    </Layout>
  );
};

export default Questionsv2;
