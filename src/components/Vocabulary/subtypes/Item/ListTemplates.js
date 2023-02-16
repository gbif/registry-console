import React from "react";
import { FormattedMessage } from 'react-intl';



export const LabelListTemplate = ({item}) => <React.Fragment><span>{item.value}</span> {item.language && <span style={{color: '#bbb'}}><FormattedMessage id={`vocabulary.language.${item.language}`}/></span>}</React.Fragment>

export const DefinitionListTemplate = ({item}) => <React.Fragment><span style={{color: '#bbb'}}><FormattedMessage id={`vocabulary.language.${item.language}`}/></span><br/><span>{item.value}</span></React.Fragment>

export const MultiMapTemplate = ({item}) => <React.Fragment><span style={{color: '#bbb'}}><FormattedMessage id={`vocabulary.language.${item.key}`}/></span><br/>{item.value.join(" | ")}</React.Fragment>