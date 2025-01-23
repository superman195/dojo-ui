// import { taskCriteria } from '@/constants';
// import useRequestTaskByTaskID from '@/hooks/useRequestTaskByTaskID';
// import { useRouter } from 'next/router';
// import { useEffect, useState } from 'react';

// const useTaskDetails = () => {
//   const [taskType, setTaskType] = useState<string>('');
//   const [multiSelectQuestionData, setMultiSelectQuestionData] = useState<string[]>([]);
//   const [rankQuestionData, setRankQuestionData] = useState<string[]>([]);
//   const [multiScoreOptions, setMultiScoreOptions] = useState<string[]>([]);
//   const [taskId, setTaskId] = useState<string>('');
//   const { task, loading, error } = useRequestTaskByTaskID(taskId);
//   const router = useRouter();

//   useEffect(() => {
//     const { taskId } = router.query;
//     if (router.isReady && taskId && typeof taskId === 'string') {
//       setTaskId(taskId);
//     }
//   }, [router]);

//   useEffect(() => {
//     if (task) {
//       setTaskType(task.type.replace(/_/g, ' '));
//       task.taskData.criteria.forEach((criterion) => {
//         switch (criterion.type) {
//           case taskCriteria.multiSelect:
//             criterion.options && setMultiSelectQuestionData(criterion.options);
//             break;
//           case taskCriteria.ranking:
//             setRankQuestionData(criterion.options || []);
//             break;
//           case 'multi-score':
//             criterion.options && setMultiScoreOptions(criterion.options);
//             break;
//         }
//       });
//     }
//   }, [task]);

//   return {
//     task,
//     taskType,
//     multiSelectQuestionData,
//     rankQuestionData,
//     multiScoreOptions,
//     loading,
//     error,
//   };
// };

// export default useTaskDetails;
