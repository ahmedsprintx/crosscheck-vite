import { addWidgetConfig, editWidgetConfig, getWidgetConfig } from 'api/v1/projects/widget';
import { useMutation, useQuery } from 'react-query';

export function useGetWidgetConfig(id) {
  return useQuery({
    queryKey: ['getWidgetConfig', id],
    queryFn: () => getWidgetConfig(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
}
export function useAddWidgetConfig() {
  return useMutation(addWidgetConfig);
}
export function useEditWidgetConfig() {
  return useMutation(editWidgetConfig);
}
