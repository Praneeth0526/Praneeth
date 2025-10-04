from django.core.management.base import BaseCommand
from main.models import VisitorAnalytics
from django.db.models import Q


class Command(BaseCommand):
    help = 'Clean up bot visits from visitor analytics'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be deleted without actually deleting',
        )
        parser.add_argument(
            '--confirm',
            action='store_true',
            help='Confirm deletion of bot visits',
        )

    def handle(self, *args, **options):
        # Bot patterns to identify and remove
        bot_patterns = [
            'UptimeRobot',
            'uptimerobot',
            'uptime robot',
            'mozilla/5.0+(compatible; uptimerobot/',
            'Pingdom',
            'Googlebot',
            'Bingbot',
            'crawler',
            'spider',
            'bot/',
            'monitoring',
            'check_http',
            'Site24x7',
            'StatusCake',
            'NewRelic',
            'HetrixTools',
            'updown.io'
        ]

        # Build query to find bot visits
        query = Q()
        for pattern in bot_patterns:
            query |= Q(user_agent__icontains=pattern)

        bot_visits = VisitorAnalytics.objects.filter(query)
        total_count = bot_visits.count()

        if total_count == 0:
            self.stdout.write(
                self.style.SUCCESS('No bot visits found in the database.')
            )
            return

        self.stdout.write(f'Found {total_count} bot visits to clean up.')

        # Show breakdown by bot type
        self.stdout.write('\nBreakdown by bot type:')
        for pattern in bot_patterns:
            count = VisitorAnalytics.objects.filter(
                user_agent__icontains=pattern
            ).count()
            if count > 0:
                self.stdout.write(f'  {pattern}: {count} visits')

        if options['dry_run']:
            self.stdout.write(
                self.style.WARNING(
                    f'\nDRY RUN: Would delete {total_count} bot visits. '
                    'Use --confirm to actually delete them.'
                )
            )
            return

        if not options['confirm']:
            self.stdout.write(
                self.style.WARNING(
                    f'\nFound {total_count} bot visits. '
                    'Use --confirm to delete them or --dry-run to see what would be deleted.'
                )
            )
            return

        # Delete bot visits
        deleted_count, _ = bot_visits.delete()
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully deleted {deleted_count} bot visits from the database.'
            )
        )

        # Show remaining stats
        remaining_visits = VisitorAnalytics.objects.count()
        self.stdout.write(f'Remaining visitor records: {remaining_visits}')