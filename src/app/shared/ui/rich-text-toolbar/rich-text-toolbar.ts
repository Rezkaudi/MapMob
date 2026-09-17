import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { isRichTextCommandActive } from '../../editing/read-rich-text-state';
import { RichTextCommand } from '../../models/rich-text-command';
import { EMPTY_RICH_TEXT_STATE, RichTextState } from '../../models/rich-text-state';
import { NgTemplateOutlet } from '@angular/common';
import { AppIcon } from '../app-icon/app-icon';
import {
  CLEAR_FORMAT_ITEM,
  RICH_TEXT_TOOLBAR_GROUPS,
  RichTextToolbarItem,
} from './rich-text-toolbar-groups';

@Component({
  selector: 'app-rich-text-toolbar',
  imports: [AppIcon, NgTemplateOutlet],
  templateUrl: './rich-text-toolbar.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RichTextToolbar {
  readonly state = input<RichTextState>(EMPTY_RICH_TEXT_STATE);
  readonly command = output<RichTextCommand>();

  protected readonly groups = RICH_TEXT_TOOLBAR_GROUPS;
  protected readonly clearFormatItem = CLEAR_FORMAT_ITEM;

  protected pressedState(item: RichTextToolbarItem): boolean | null {
    return item.canBePressed ? isRichTextCommandActive(item.command, this.state()) : null;
  }
}
