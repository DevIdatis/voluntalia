import { useActivities } from '@/hooks/activity/useActivities';
import { useCreateActivity } from '@/hooks/activity/useCreateActivity';
import { useUpdateActivity } from '@/hooks/activity/useUpdateActivity';
import { useDeleteActivity } from '@/hooks/activity/useDeleteActivity';
import { useSearchAndFilter } from '@/hooks/common/useSearchAndFilter';
import { useModal } from '@/hooks/common/useModal';
import { useFormData } from '@/hooks/common/useFormData';
import { useStats } from '@/hooks/common/useStats';
import { useConfirmDialog } from '@/hooks/common/useConfirmDialog';
import { useToast } from '@/hooks/use-toast';
import { ActivityTask } from '@/types/activity';
import { Clock, CheckCircle, FileText } from 'lucide-react';
import { useTranslation } from "react-i18next";

interface ActivityFormData {
  name: string;
  description: string;
}

const initialFormData: ActivityFormData = {
  name: '',
  description: '',
};

export const useActivitiesPage = () => {
  const { t } = useTranslation();
  const { toast } = useToast();

  // Data hooks
  const { data: activities = [], isLoading } = useActivities();
  const createActivity = useCreateActivity();
  const updateActivity = useUpdateActivity();
  const deleteActivity = useDeleteActivity();

  // Search and filtering
  const searchAndFilter = useSearchAndFilter({
    data: activities,
    searchFields: ['title', 'description'] as (keyof ActivityTask)[],
    itemsPerPage: 10,
  });

  // Modals
  const createModal = useModal();
  const editModal = useModal<ActivityTask>();
  const confirmDialog = useConfirmDialog();
  const showVolunteersModal = useModal<ActivityTask>();

  // Form handling
  const validateForm = (data: ActivityFormData) => {
    const errors: Record<string, string> = {};
    if (!data.name.trim()) {
      errors.name = 'Activity name is required';
    }
    return Object.keys(errors).length > 0 ? errors : null;
  };

  const form = useFormData({
    initialValues: initialFormData,
    validate: validateForm,
  });

  // Stats configuration
  const statsConfig = [
    {
      key: 'total',
      label: 'Total Activities',
      calculate: (data: ActivityTask[]) => data.length,
      icon: FileText,
      color: 'text-primary',
    },
    {
      key: 'filtered',
      label: 'Filtered Results',
      calculate: () => searchAndFilter.filteredData.length,
      icon: CheckCircle,
      color: 'text-primary',
    },
    {
      key: 'withDescription',
      label: 'With Descriptions',
      calculate: (data: ActivityTask[]) =>
        data.filter((a) => a.description).length,
      icon: Clock,
      color: 'text-primary',
    },
  ];

  const { stats } = useStats(activities, statsConfig);

  // Actions
  const handleCreate = async () => {
    try {
      await createActivity.mutateAsync({
        title: form.formData.name.trim(),
        description: form.formData.description.trim() || undefined,
        date: new Date(Date.UTC(2025, 8, 24)),
      });

      createModal.closeModal();
      form.resetForm();
      toast({
        title: 'Success',
        description: 'Activity created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create activity',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (activity: ActivityTask) => {
    form.updateFormData({
      name: activity.title,
      description: activity.description || '',
    });
    editModal.openModal(activity);
  };

  const handleUpdate = async () => {
    if (!editModal.data) return;

    try {
      await updateActivity.mutateAsync({
        id: editModal.data.id,
        data: {
          title: form.formData.name.trim(),
          description: form.formData.description.trim() || undefined,
        },
      });

      editModal.closeModal();
      form.resetForm();
      toast({
        title: t("activities.modal.edit.toast.title"),
        description: t("activities.modal.edit.toast.success"),
      });
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("activities.modal.edit.toast.error"),
        variant: 'destructive',
      });
    }
  };

  const handleDelete = (activity: ActivityTask) => {
    confirmDialog.showDialog({
      title: t("activities.modal.delete.title"),
      description: t("activities.modal.delete.description", {activity: activity.title}),
      confirmText: t("common.delete"),
      variant: 'destructive',
      onConfirm: async () => {
        try {
          await deleteActivity.mutateAsync(activity.id);
          toast({
            title: t("common.success"),
            description: t("activities.modal.delete.success"),
          });
        } catch (error) {
          toast({
            title: t("common.error"),
            description: t("activities.modal.delete.error"),
            variant: 'destructive',
          });
        }
      },
    });
  };

  const handleModalClose = () => {
    form.resetForm();
  };

  const handleShowVolunteers = (activity: ActivityTask) => {
    showVolunteersModal.openModal(activity);
  };

  return {
    // Data
    activities,
    isLoading,
    stats,

    // Search and filter
    searchAndFilter,

    // Modals
    createModal,
    editModal,
    confirmDialog,
    showVolunteersModal,

    // Form
    form,

    // Actions
    handleCreate,
    handleEdit,
    handleUpdate,
    handleDelete,
    handleModalClose,
    handleShowVolunteers,

    // Loading states
    isCreating: createActivity.isPending,
    isUpdating: updateActivity.isPending,
    isDeleting: deleteActivity.isPending,
  };
};
