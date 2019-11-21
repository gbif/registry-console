import React from "react";


export const LabelListTemplate = ({item}) => <React.Fragment><span>{item.value}</span> {item.key && <span style={{color: '#bbb'}}>{item.key}</span>}</React.Fragment>

export const DefinitionListTemplate = ({item}) => <React.Fragment><span style={{color: '#bbb'}}>{item.key}</span><br/><span>{item.value}</span></React.Fragment>

export const MultiMapTemplate = ({item}) => <React.Fragment><span style={{color: '#bbb'}}>{item.key}</span><br/>{item.value.join(" | ")}</React.Fragment>