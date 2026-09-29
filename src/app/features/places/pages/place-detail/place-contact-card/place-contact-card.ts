import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
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
  readonly edit = output<void>();

  protected readonly links = computed<ContactLink[]>(() => {
    const contact = this.contact();
    return [
      {
        icon: 'phone-feather',
        label: contact.phone,
        href: `tel:${contact.phone}`,
      },
      {
        icon: 'whatsapp-fill',
        label: contact.whatsapp,
        href: `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`,
      },
      {
        icon: 'facebook-feather',
        label: contact.facebook,
        href: contact.facebook,
      },
      {
        icon: 'instagram-fill',
        label: contact.instagram,
        href: contact.instagram,
      },
    ];
  });
}
