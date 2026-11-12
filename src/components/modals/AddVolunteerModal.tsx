import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCreateUser } from '@/hooks/user/useCreateUser';
import { useUpdateUser } from '@/hooks/user/useUpdateUser';
import { CreateUserDTO, User } from '@/types/user';
import { useSkills } from '@/hooks/skill/useSkills';
import { useTranslation } from "react-i18next";

interface AddVolunteerModalProps {
  open: boolean;
  isEdit?: boolean;
  volunteer?: User | null;
  onOpenChange: (open: boolean) => void;
  onAdd?: (volunteer: unknown) => void;
}

type UserBase = Pick<
  User,
  'name' | 'email' | 'phone' | 'country' | 'city' | 'role'
>;

const AddVolunteerModal: React.FC<AddVolunteerModalProps> = ({
  open,
  isEdit,
  volunteer,
  onOpenChange,
  onAdd,
}) => {
  const { toast } = useToast();
  const { mutate, isPending, error } = useCreateUser();
  const {
    mutate: mutateUpdate,
    isPending: isUpdating,
    error: errorOnUpdate,
  } = useUpdateUser();
  const { data: allSkills = [] } = useSkills();
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [skillSearch, setSkillSearch] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    address: '',
    emergency_contact: '',
    emergency_phone: '',
    availability: '',
    motivation: '',
  });

  // Populate form when editing, or reset when adding new volunteer
  useEffect(() => {
    if (open) {
      if (isEdit && volunteer) {
        // Split name into first and last name
        const nameParts = volunteer.name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        setFormData({
          firstName,
          lastName,
          email: volunteer.email,
          phone: volunteer.phone || '',
          country: volunteer.country,
          city: volunteer.city,
          address: '',
          emergency_contact: '',
          emergency_phone: '',
          availability: '',
          motivation: '',
        });

        // Pre-populate skills if available
        // Note: We need to check if volunteer has skills data
        // For now, we'll reset skills - can be enhanced when backend provides skills
        setSelectedSkills(new Set());
      } else {
        // Reset form for adding new volunteer
        resetForm();
      }
    }
  }, [open, isEdit, volunteer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const name = `${formData.firstName} ${formData.lastName}`;

    if (isEdit && volunteer) {
      // Update existing volunteer
      const updatePayload = {
        name,
        phone: formData.phone,
        country: formData.country,
        city: formData.city,
        skills: selectedSkills.size > 0 ? Array.from(selectedSkills) : [],
      };

      console.log('Update payload:', updatePayload);
      mutateUpdate(
        { id: volunteer.id, data: updatePayload },
        {
          onSuccess: (updatedVolunteer) => {
            console.log('Updated volunteer:', updatedVolunteer);
            toast({
              title: 'Volunteer Updated Successfully',
              description: `${name} has been updated.`,
            });
            onOpenChange(false);
            resetForm();
          },
          onError: (err) => {
            console.log('Update error:', err);
            toast({
              title: 'Error',
              description: 'Failed to update volunteer. Please try again.',
              variant: 'destructive',
            });
          },
        }
      );
    } else {
      // Create new volunteer
      const createPayload = {
        name,
        email: formData.email,
        password: 'aaa111',
        country: formData.country,
        city: formData.city,
        skills: selectedSkills.size > 0 ? Array.from(selectedSkills) : [],
        phone: formData.phone,
      };

      console.log('Create payload:', createPayload);
      mutate(createPayload, {
        onSuccess: (newVolunteer) => {
          onAdd?.(newVolunteer);
          console.log('New volunteer:', newVolunteer);
          toast({
            title: 'Volunteer Added Successfully',
            description: `${newVolunteer.name} has been added.`,
          });
          onOpenChange(false);
          resetForm();
        },
        onError: (err) => {
          console.log('Create error:', err);
          toast({
            title: 'Error',
            description: 'Failed to add volunteer. Please try again.',
            variant: 'destructive',
          });
        },
      });
    }
  };

  const handleAddSkill = (skillId: string) => {
    const newSelected = new Set(selectedSkills);
    newSelected.add(skillId);
    setSelectedSkills(newSelected);
    setSkillSearch('');
    console.log(selectedSkills);
  };

  const handleRemoveSkill = (skillId: string) => {
    const newSelected = new Set(selectedSkills);
    newSelected.delete(skillId);
    setSelectedSkills(newSelected);
  };

  const filteredSkills = allSkills
    .filter(
      (skill) =>
        !selectedSkills.has(skill.id) &&
        skill.name.toLowerCase().includes(skillSearch.toLowerCase())
    )
    .slice(0, 5);

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      country: '',
      city: '',
      address: '',
      emergency_contact: '',
      emergency_phone: '',
      availability: '',
      motivation: '',
    });
    setSelectedSkills(new Set());
    setSkillSearch('');
  };

  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t("volunteers.modal.edit.title") : t("volunteers.modal.add.title")}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? t("volunteers.modal.edit.description")
              : t("volunteers.modal.add.description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("volunteers.modal.form.personalInfo.title")}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t("volunteers.modal.form.personalInfo.name")} *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t("volunteers.modal.form.personalInfo.lastName")} *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("volunteers.modal.form.personalInfo.email")} *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  disabled={isEdit}
                  className={isEdit ? 'bg-muted cursor-not-allowed' : ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t("volunteers.modal.form.personalInfo.phone")} *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">{t("volunteers.modal.form.personalInfo.country")} *</Label>
                <Input
                  id="country"
                  type="text"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">{t("volunteers.modal.form.personalInfo.city")} *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("volunteers.modal.form.emergencyContact.title")}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergency_contact">
                  {t("volunteers.modal.form.emergencyContact.name")}
                </Label>
                <Input
                  id="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergency_contact: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency_phone">{t("volunteers.modal.form.emergencyContact.phone")}</Label>
                <Input
                  id="emergency_phone"
                  value={formData.emergency_phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergency_phone: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("volunteers.modal.form.skillsAndInterests.title")} </h3>
            <div className="space-y-2">
              <Label htmlFor="skillSearch">{t("volunteers.modal.form.skillsAndInterests.label")}</Label>
              <div className="relative">
                <Input
                  id="skillSearch"
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  placeholder={t("volunteers.modal.form.skillsAndInterests.searchPlaceholder")}
                />
                {skillSearch && filteredSkills.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredSkills.map((skill) => (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => handleAddSkill(skill.id)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        {skill.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {selectedSkills.size > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {allSkills
                    .filter((s) => selectedSkills.has(s.id))
                    .map((skill) => (
                      <Badge
                        key={skill.id}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {skill.name}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill.id)}
                          className="ml-1 hover:bg-destructive/20 rounded-full"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("volunteers.modal.form.aditionalInfo.title")}</h3>
            <div className="space-y-2">
              <Label htmlFor="availability">{t("volunteers.modal.form.aditionalInfo.label")}</Label>
              <Select
                value={formData.availability}
                onValueChange={(value) =>
                  setFormData({ ...formData, availability: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("volunteers.modal.form.aditionalInfo.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekdays">{t("volunteers.modal.form.aditionalInfo.options.weekdays")}</SelectItem>
                  <SelectItem value="weekends">{t("volunteers.modal.form.aditionalInfo.options.weekends")}</SelectItem>
                  <SelectItem value="evenings">{t("volunteers.modal.form.aditionalInfo.options.evenings")}</SelectItem>
                  <SelectItem value="flexible">{t("volunteers.modal.form.aditionalInfo.options.flexible")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="motivation">{t("volunteers.modal.form.aditionalInfo.motivation")}</Label>
              <Textarea
                id="motivation"
                value={formData.motivation}
                onChange={(e) =>
                  setFormData({ ...formData, motivation: e.target.value })
                }
                placeholder={t("volunteers.modal.form.aditionalInfo.motivationDescription")}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || isUpdating}
              className="bg-gradient-primary"
            >
              {isEdit
                ? isUpdating
                  ? t("volunteers.modal.form.buttons.updating")
                  : t("volunteers.modal.form.buttons.edit")
                : isPending
                  ? t("volunteers.modal.form.buttons.adding")
                  : t("volunteers.modal.form.buttons.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVolunteerModal;
