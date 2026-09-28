import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { buildCurlExample } from '../../export/curl-example';
import { ApiEndpoint } from '../../models/api-endpoint';
import { ApiFeature } from '../../models/api-feature';
import { errorCasesFor } from '../../state/error-cases';
import { pathParamsFor } from '../../state/path-params';
import { prettyJson } from '../../state/pretty-json';
import { requiredPermission } from '../../state/required-permission';
import { CodeBlock } from '../code-block/code-block';
import { ErrorTable } from '../error-table/error-table';
import { FieldTable } from '../field-table/field-table';
import { SectionLabel } from '../section-label/section-label';

const SUCCESS_CLASSES = 'bg-success-soft text-[#0B7A52]';

@Component({
  selector: 'app-endpoint-details',
  imports: [CodeBlock, ErrorTable, FieldTable, SectionLabel],
  templateUrl: './endpoint-details.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EndpointDetails {
  readonly feature = input.required<ApiFeature>();
  readonly endpoint = input.required<ApiEndpoint>();

  protected readonly successClasses = SUCCESS_CLASSES;
  protected readonly pathParams = computed(() => pathParamsFor(this.endpoint()));
  protected readonly errorCases = computed(() => errorCasesFor(this.feature(), this.endpoint()));
  protected readonly curl = computed(() => buildCurlExample(this.endpoint()));
  protected readonly requestJson = computed(() => prettyJson(this.endpoint().body?.example));
  protected readonly responseJson = computed(() => {
    const example = this.endpoint().response.example;
    return example === undefined ? null : prettyJson(example);
  });
  protected readonly permissionText = computed(() => {
    const endpoint = this.endpoint();
    const permission = requiredPermission(this.feature(), endpoint);
    if (permission) {
      return permission;
    }
    return endpoint.isPublic ? 'None — public' : 'Any signed-in admin';
  });
}
