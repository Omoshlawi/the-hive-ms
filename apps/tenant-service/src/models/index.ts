import db from "@/services/db";
export const TenantsModel = db.tenant;
export const TenantStatusHistoryModel = db.tenantStatusHistory;
export const TenantReferencesModel = db.tenantReference;
export const TenancyApplicationsModel = db.tenancyApplication;
export const TenancyApplicationStatusHistoryModel =
  db.tenancyApplicationStatusHistory;
export const CoApplicantsModel = db.coApplicant;
export const TenancyAgrementModel = db.tenancyAgreement;
export const AgreementStatusHistoryModel = db.agreementStatusHistory;
export const TenantDocumentsModel = db.tenantDocument;
export const BackgroundCheckStatusHistoryModel =
  db.backgroundCheckStatusHistory;
export const ScreeningQuestionsModel = db.screeningQuestion;
export const ScreeningResponsesModel = db.screeningResponse;
export const ScreeningQuestionTemplatesModel = db.screeningQuestionTemplate;
export const ListingScreeningConfigsModel = db.propertyScreeningConfig;
export const AdditionalChargesModel = db.additionalCharge;
export const AgreementParticipantsModel = db.agreementParticipant;
