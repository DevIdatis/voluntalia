import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";



interface AdvancedFiltersProps {
  skillFilter: string;
  onSkillFilterChange: (value: string) => void;
  hoursRange: string;
  onHoursRangeChange: (value: string) => void;
  eventsRange: string;
  onEventsRangeChange: (value: string) => void;
  joinDateFilter: string;
  onJoinDateFilterChange: (value: string) => void;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  skillFilter,
  onSkillFilterChange,
  hoursRange,
  onHoursRangeChange,
  eventsRange,
  onEventsRangeChange,
  joinDateFilter,
  onJoinDateFilterChange
}) => {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border">
      <Select value={skillFilter} onValueChange={onSkillFilterChange}>
        <SelectTrigger>
          <SelectValue placeholder={t("volunteers.searchBar.filterPlaceholder")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("common.allRoles")}</SelectItem>
          <SelectItem value="admin">{t("common.admin")}</SelectItem>
          <SelectItem value="volunteer">{t("common.volunteer")}</SelectItem>
          <SelectItem value="coordinator">{t("common.coordinator")}</SelectItem>
        </SelectContent>
      </Select>

      <Select value={hoursRange} onValueChange={onHoursRangeChange}>
        <SelectTrigger>
          <SelectValue placeholder={t("volunteers.searchBar.hoursRangePlaceholder")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("common.allHours")}  </SelectItem>
          <SelectItem value="0-50">0-50 {t("common.hours")}</SelectItem>
          <SelectItem value="51-100">51-100 {t("common.hours")}</SelectItem>
          <SelectItem value="101-200">101-200 {t("common.hours")}</SelectItem>
          <SelectItem value="201+">200+ {t("common.hours")}</SelectItem>
        </SelectContent>
      </Select>

      <Select value={eventsRange} onValueChange={onEventsRangeChange}>
        <SelectTrigger>
          <SelectValue placeholder="Events Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("common.allEvents")}</SelectItem>
          <SelectItem value="0-10">0-10 {t("common.event")}</SelectItem>
          <SelectItem value="11-20">11-20 {t("common.event")}</SelectItem>
          <SelectItem value="21+">20+ {t("common.event")}</SelectItem>
        </SelectContent>
      </Select>

      <Select value={joinDateFilter} onValueChange={onJoinDateFilterChange}>
        <SelectTrigger>
          <SelectValue placeholder="Join Date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("common.allPeriods")}</SelectItem>
          <SelectItem value="recent">{t("common.recent")}</SelectItem>
          <SelectItem value="2023">2023</SelectItem>
          <SelectItem value="2022">2022</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};