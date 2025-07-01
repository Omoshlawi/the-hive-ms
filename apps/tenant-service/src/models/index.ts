import db from "@/services/db";
export const TenantsModel = db.tenant;
export const TenantStatusHistoryModel = db.tenantStatusHistory;
export const TenantReferencesModel = db.tenantReference;
export const RentalApplicationsModel = db.rentalApplication;
export const RentalApplicationStatusHistoryModel =
  db.rentalApplicationStatusHistory;
export const CoApplicantsModel = db.coApplicant;
export const RentalAgrementModel = db.rentalAgreement;
export const AgreementStatusHistoryModel = db.agreementStatusHistory;
export const TenantDocumentsModel = db.tenantDocument;
export const BackgroundCheckStatusHistoryModel =
  db.backgroundCheckStatusHistory;
export const ScreeningQuestionsModel = db.screeningQuestion;
export const ScreeningResponsesModel = db.screeningResponse;
export const ScreeningQuestionTemplatesModel = db.screeningQuestionTemplate;
export const ListingScreeningConfigsModel = db.propertyScreeningConfig;
