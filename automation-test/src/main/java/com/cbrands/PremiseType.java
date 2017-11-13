package com.cbrands;

public enum PremiseType {
  All("All"),
  Off("Off-Premise"),
  On("On-Premise");

  private final String label;

  PremiseType(String label) {
    this.label = label;
  }

  public String label() {
    return label;
  }
}
