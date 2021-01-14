import { HeadlessEngine, searchAppReducers } from "@coveo/headless";

export const engine = new HeadlessEngine({
  // configuration: HeadlessEngine.getSampleConfiguration(),
  configuration: {
    organizationId: 'williamonboarding1digvwql',
    accessToken: 'xx42a566f8-e334-4300-bfc5-346171ebfa95',
    platformUrl: 'https://platformqa.cloud.coveo.com'
  },
  reducers: searchAppReducers
});
