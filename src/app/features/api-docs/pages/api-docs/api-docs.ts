import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  Injector,
  afterNextRender,
  computed,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiReferenceExporter } from '../../export/api-reference-exporter';
import { ApiDocsStore } from '../../state/api-docs.store';
import { docsNavGroups } from '../../state/docs-nav-groups';
import { SectionScroller } from '../../state/section-scroller';
import { ConventionCard } from '../../ui/convention-card/convention-card';
import { DatabaseSection } from '../../ui/database-section/database-section';
import { DocsExportPanel } from '../../ui/docs-export-panel/docs-export-panel';
import { DocsHero } from '../../ui/docs-hero/docs-hero';
import { DocsMobileNav } from '../../ui/docs-mobile-nav/docs-mobile-nav';
import { DocsOverview } from '../../ui/docs-overview/docs-overview';
import { DocsSectionHeading } from '../../ui/docs-section-heading/docs-section-heading';
import { DocsSidebar } from '../../ui/docs-sidebar/docs-sidebar';
import { DocsTable } from '../../ui/docs-table/docs-table';
import { DocsToolbar } from '../../ui/docs-toolbar/docs-toolbar';
import { EndpointSection } from '../../ui/endpoint-section/endpoint-section';
import { WholeErd } from '../../ui/whole-erd/whole-erd';

const EXPORT_SECTION_ID = 'export';
/** Pixels from the bottom that still count as scrolled to the end. */
const END_TOLERANCE = 4;

@Component({
  selector: 'app-api-docs',
  imports: [
    ConventionCard,
    DatabaseSection,
    DocsExportPanel,
    DocsHero,
    DocsMobileNav,
    DocsOverview,
    DocsSectionHeading,
    DocsSidebar,
    DocsTable,
    DocsToolbar,
    EndpointSection,
    WholeErd,
  ],
  templateUrl: './api-docs.html',
  providers: [ApiDocsStore],
  host: { class: 'block h-full' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiDocsPage {
  protected readonly store = inject(ApiDocsStore);
  private readonly exporter = inject(ApiReferenceExporter);
  private readonly scroller = inject(SectionScroller);
  private readonly injector = inject(Injector);
  private readonly document = inject(DOCUMENT);
  private readonly route = inject(ActivatedRoute);
  private isReadingCheckQueued = false;

  protected readonly reference = this.store.reference;
  protected readonly contentLink = this.scroller.linkTo('docs-content');
  protected readonly pagePath = this.contentLink.slice(0, this.contentLink.indexOf('#'));
  private readonly sectionIds = computed(() =>
    docsNavGroups(this.reference().features, this.reference().domains).flatMap((group) =>
      group.links.map((link) => link.id),
    ),
  );

  constructor() {
    afterNextRender(() => {
      this.openSharedLink();
      this.trackReading();
    });
  }

  /** Runs at most once a frame, however fast the scroll events come. */
  protected trackReading(scrollBox?: HTMLElement): void {
    if (this.isReadingCheckQueued) {
      return;
    }
    this.isReadingCheckQueued = true;
    this.document.defaultView?.requestAnimationFrame(() => {
      this.isReadingCheckQueued = false;
      const isAtEnd =
        !!scrollBox &&
        scrollBox.scrollTop + scrollBox.clientHeight >= scrollBox.scrollHeight - END_TOLERANCE;
      this.store.setActiveSection(this.scroller.activeSectionIn(this.sectionIds(), isAtEnd));
    });
  }

  protected toggleEndpoint(endpointId: string): void {
    const isOpening = !this.store.isOpen(endpointId);
    this.store.toggleEndpoint(endpointId);
    if (isOpening) {
      this.scroller.replaceHash(endpointId);
    }
  }

  protected goTo(sectionId: string): void {
    this.scroller.scrollTo(sectionId);
    this.scroller.replaceHash(sectionId);
  }

  protected goToExport(): void {
    this.scroller.scrollTo(EXPORT_SECTION_ID);
  }

  protected downloadReadme(): void {
    this.exporter.downloadReadme();
  }

  /** Opens every endpoint, waits for it to draw, then hands the page to the print dialog. */
  protected printPdf(): void {
    this.store.startPrinting();
    afterNextRender(
      () => {
        this.exporter.printPdf();
        this.store.stopPrinting();
      },
      { injector: this.injector },
    );
  }

  /** A link such as /docs#places-list opens that endpoint and scrolls to it. */
  private openSharedLink(): void {
    const targetId = this.route.snapshot.fragment;
    if (!targetId) {
      return;
    }
    const isEndpoint = this.reference().features.some((feature) =>
      feature.endpoints.some((endpoint) => endpoint.id === targetId),
    );
    if (isEndpoint) {
      this.store.openEndpoint(targetId);
    }
    afterNextRender(() => this.scroller.scrollTo(targetId), { injector: this.injector });
  }
}
