import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AppIcon } from '../../../../../shared/ui/app-icon/app-icon';
import { InfoCard } from '../../../../../shared/ui/info-card/info-card';
import { PlaceContact } from '../../../models/place-contact';
import { ContactLink } from './contact-link';

@Component({
  selector: 'app-place-contact-card',
  imports: [AppIcon, InfoCard],
  templateUrl: './place-contact-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceContactCard {
  readonly contact = input.required<PlaceContact>();

  protected readonly links = computed<ContactLink[]>(() => {
    const contact = this.contact();
    return [
      {
        icon: 'phone',
        label: contact.phone,
        href: `tel:${contact.phone}`,
        colorClass: 'bg-primary',
      },
      {
        icon: 'whatsapp',
        label: contact.whatsapp,
        href: `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`,
        colorClass: 'bg-[#25d366]',
      },
      {
        icon: 'facebook',
        label: contact.facebook,
        href: contact.facebook,
        colorClass: 'bg-[#1877f2]',
      },
      {
        icon: 'instagram',
        label: contact.instagram,
        href: contact.instagram,
        colorClass: 'bg-[#e1306c]',
      },
    ];
  });
}
