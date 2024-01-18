import SSF from 'ssf';
import {trimSpecialCharacters} from './string';

export function processPivot(data, queryResponse, config, viz, pivotKey) {
  let dims, meas;
  let mesID, mesData, mesLabel, mesRendered;
  let tarID, tarData, tarValue, tarLabel, tarBase, tarRendered, tarDim;

  data = data.length === undefined ? [data] : data;
  dims = queryResponse['fields']['dimension_like'];
  meas = queryResponse['fields']['measure_like'];

  mesID = meas[0]['name'];
  mesData = data[0][mesID][pivotKey];
  mesLabel =
    meas[0]['label_short'] === undefined
      ? meas[0]['label']
      : meas[0]['label_short'];
  mesRendered =
    mesData.rendered === undefined ? mesData.value : mesData.rendered;

  if (config.target_source === 'second') {
    if (meas.length < 2) {
      viz.addError({
        title: 'Invalid Input.',
        message: 'Add a second measure or modify target label source.',
      });
    }
    tarID = meas[1]['name'];
    tarData = data[0][tarID][pivotKey];
    tarValue = tarData.value;
    tarLabel =
      meas[1]['label_short'] === undefined
        ? meas[1]['label']
        : meas[1]['label_short'];
    tarBase = tarData.rendered === undefined ? tarData.value : tarData.rendered;
    tarRendered =
      config.target_value_format === undefined ||
      config.target_value_format === ''
        ? tarBase
        : SSF.format(config.target_value_format, tarValue);
    if (dims.length > 0) {
      tarDim =
        config.target_label_override === undefined ||
        config.target_label_override === ''
          ? pivotKey
          : config.target_label_override;
    }
  } else if (config.target_source === 'first') {
    if (config.viz_trellis_by === 'row') {
      viz.addError({
        title: 'Invalid Input.',
        message:
          'This option cannot be applied to a trellis. Please modify target label source.',
      });
    } else if (data.length < 2) {
      viz.addError({
        title: 'Invalid Input.',
        message: 'No value to target. Add a second row or modify label type.',
      });
    }
    tarData = data[1][mesID][pivotKey];
    tarValue = tarData.value;
    tarBase =
      tarData.rendered === undefined || tarData.rendered === ''
        ? tarValue
        : tarData.rendered;
    tarLabel = mesLabel;
    tarRendered =
      config.target_value_format === undefined ||
      config.target_value_format === ''
        ? tarBase
        : SSF.format(config.target_value_format, tarValue);
    if (dims.length > 0) {
      tarDim =
        config.target_label_override === undefined ||
        config.target_label_override === ''
          ? pivotKey
          : config.target_label_override;
    }
  } else if (config.target_source === 'override') {
    if (
      config.target_value_override === undefined ||
      config.target_value_override === ''
    ) {
      viz.addError({
        title: 'Invalid Input.',
        message:
          'No target override. Add an override value or modify target label source.',
      });
    }
    tarValue = parseFloat(config.target_value_override);
    tarBase = tarValue;
    tarLabel = config.target_label_override;
    tarRendered =
      config.target_value_format === undefined ||
      config.target_value_format === ''
        ? tarBase
        : SSF.format(config.target_value_format, tarValue);
    if (dims.length > 0) {
      tarDim =
        config.target_label_override === undefined ||
        config.target_label_override === ''
          ? pivotKey
          : config.target_label_override;
    }
  }

  let chunk = {
    value: mesData.value,
    value_links: mesData.links,
    value_label:
      config.value_label_override === undefined ||
      config.value_label_override === ''
        ? mesLabel
        : config.value_label_override,
    value_rendered:
      config.value_formatting === undefined || config.value_formatting === ''
        ? mesRendered
        : SSF.format(config.value_formatting, mesData.value),
    value_dimension:
      config.value_label_override === undefined ||
      config.value_label_override === ''
        ? trimSpecialCharacters(pivotKey)
        : config.value_label_override,
    target: tarValue,
    target_rendered: tarRendered,
    target_label:
      config.target_label_override === undefined ||
      config.target_label_override === ''
        ? tarLabel
        : config.target_label_override,
    target_dimension: tarDim,
  };
  return chunk;
}