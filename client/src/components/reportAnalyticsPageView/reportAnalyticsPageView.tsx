import {useEffect} from 'react';
import 'autotrack/lib/plugins/event-tracker';
import 'autotrack/lib/plugins/outbound-link-tracker';
import 'autotrack/lib/plugins/url-change-tracker';
import {withAppConfig, WithAppConfigProps} from "../hoc/withAppConfig";


declare var ga: (action: string, type: string, options?: any) => void;

interface ReportAnalyticsPageViewProps extends WithAppConfigProps {}

function ReportAnalyticsPageView(props: ReportAnalyticsPageViewProps) {

  useEffect(() => {
    if (typeof ga !== "undefined") {
      ga('create', props.config.googleAnalyticsId, 'auto');

      ga('require', 'eventTracker');
      ga('require', 'outboundLinkTracker');
      ga('require', 'urlChangeTracker');

      ga('send', 'pageview');
    }
  }, [props.config.googleAnalyticsId])

  return null;
}

export default withAppConfig(ReportAnalyticsPageView);
