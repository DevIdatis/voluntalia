import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Loader2, Award } from 'lucide-react';
import { PageLayout } from '@/components/common/PageLayout';
import { StatsGrid } from '@/components/common/StatsGrid';
import { SearchFilterBar } from '@/components/common/SearchFilterBar';
import { FormModal } from '@/components/common/FormModal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useActivitiesPage } from '@/hooks/pages/useActivitiesPage';
import { ManageSkillsModal } from '@/components/modals/ManageSkillsModal';
import { useTranslation } from "react-i18next";

export default function Activities() {
  const { t } = useTranslation();
  const [skillsModalOpen, setSkillsModalOpen] = useState(false);
  const {
    // Data
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
    isCreating,
    isUpdating,
  } = useActivitiesPage();

  return (
    <PageLayout
      title={t("activities.title")}
      description={t("activities.description")}
    >
      {/* Stats */}
      <StatsGrid stats={stats} columns={3} className="mb-6" />

      {/* Search and Filter */}
      <SearchFilterBar
        searchTerm={searchAndFilter.searchTerm}
        onSearchChange={searchAndFilter.setSearchTerm}
        searchPlaceholder={t("activities.searchFilter.placeholder")}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setSkillsModalOpen(true)}
              className="shadow-soft"
            >
              <Award className="h-4 w-4 mr-2" />
              {t("activities.searchFilter.manage")}
            </Button>
            <Button
              onClick={() => createModal.openModal()}
              className="shadow-soft"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("activities.searchFilter.add")}
            </Button>
          </div>
        }
        className="mb-6"
      />

      {/* Activities Table */}
      <Card className="shadow-soft border-accent/20">
        <CardHeader>
          <CardTitle>{t("activities.table.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : searchAndFilter.filteredData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchAndFilter.searchTerm
                  ? t("activities.table.searchNoMatch")
                  : t("activities.table.noActivities")}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("common.name")}</TableHead>
                  <TableHead>{t("common.description")}</TableHead>
                  <TableHead>{t("common.volunteers")}</TableHead>
                  <TableHead>{t("common.status")}</TableHead>
                  <TableHead className="text-right">{t("common.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchAndFilter.filteredData.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">
                      {activity.title}
                    </TableCell>
                    <TableCell>
                      {activity.description ? (
                        <span className="text-sm text-muted-foreground">
                          {activity.description.length > 50
                            ? `${activity.description.substring(0, 50)}...`
                            : activity.description}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          {t("common.noDescription")}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="default"
                        onClick={() => handleShowVolunteers(activity)}
                      >
                        {activity.totalVolunteers}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{t("common.active")}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(activity)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(activity)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Activity Modal */}
      <FormModal
        isOpen={createModal.isOpen}
        onClose={() => {
          createModal.closeModal();
          handleModalClose();
        }}
        onSubmit={handleCreate}
        title={t("activities.modal.add.title")}
        submitText={t("activities.modal.add.submit")}
        isLoading={isCreating}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">{t("activities.modal.add.name")} *</Label>
            <Input
              id="name"
              value={form.formData.name}
              onChange={(e) => form.updateField('name', e.target.value)}
              placeholder={t("activities.modal.add.placeholder")}
            />
            {form.errors.name && (
              <p className="text-sm text-destructive mt-1">
                {form.errors.name}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="description">{t("common.description")}</Label>
            <Textarea
              id="description"
              value={form.formData.description}
              onChange={(e) => form.updateField('description', e.target.value)}
              placeholder={t("activities.modal.add.descriptionPlaceholder")}
              rows={3}
            />
          </div>
        </div>
      </FormModal>

      {/* Edit Activity Modal */}
      <FormModal
        isOpen={editModal.isOpen}
        onClose={() => {
          editModal.closeModal();
          handleModalClose();
        }}
        onSubmit={handleUpdate}
        title={t("activities.modal.edit.title")}
        submitText={t("activities.modal.edit.submit")}
        isLoading={isUpdating}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-name">{t("activities.modal.add.name")} *</Label>
            <Input
              id="edit-name"
              value={form.formData.name}
              onChange={(e) => form.updateField('name', e.target.value)}
              placeholder={t("activities.modal.add.placeholder")}
            />
            {form.errors.name && (
              <p className="text-sm text-destructive mt-1">
                {form.errors.name}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="edit-description">{t("common.description")}</Label>
            <Textarea
              id="edit-description"
              value={form.formData.description}
              onChange={(e) => form.updateField('description', e.target.value)}
              placeholder={t("activities.modal.add.descriptionPlaceholder")}
              rows={3}
            />
          </div>
        </div>
      </FormModal>

      {/* Show Volunteers Modal */}
      <FormModal
        onSubmit={() => {
          showVolunteersModal.closeModal();
          handleModalClose();
        }}
        isOpen={showVolunteersModal.isOpen}
        onClose={() => {
          showVolunteersModal.closeModal();
          handleModalClose();
        }}
        title={`${t("activities.modal.volunteers.title")} ${showVolunteersModal.data?.title}`}
        submitText={t("common.close")}
      >
        <div className="space-y-4">
          <div>
            <div className="my-6 max-w-md">
              <div className="max-h-60 overflow-y-auto">
                {showVolunteersModal.data?.volunteers.map((volunteer) => (
                  <div
                    key={volunteer.id}
                    className="py-1 grid grid-cols-2 px-2 border-b last:border-0 hover:bg-accent/10"
                  >
                    <span className="text-sm text-muted-foreground">
                      {volunteer.name}
                    </span>
                    <Badge
                      variant="default"
                      className="justify-self-end cursor-pointer"
                    >
                      <span className="text-xs text-white font-bold">
                        {volunteer.email}
                      </span>
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FormModal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={confirmDialog.hideDialog}
        onConfirm={confirmDialog.handleConfirm}
        isLoading={confirmDialog.isConfirming}
        title={confirmDialog.data?.title || ''}
        description={confirmDialog.data?.description || ''}
        confirmText={confirmDialog.data?.confirmText}
        cancelText={confirmDialog.data?.cancelText}
        variant={confirmDialog.data?.variant}
      />
      {/* Manage Skills Modal */}
      {skillsModalOpen && (
        <ManageSkillsModal
          open={skillsModalOpen}
          onOpenChange={setSkillsModalOpen}
        />
      )}
    </PageLayout>
  );
}
