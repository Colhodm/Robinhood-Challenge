package models

// TODO Should make usage have a defined type instead of string
type Stocks struct {
	Tickers []string `json:"tickers,omitempty"`
}
type Name struct {
	Stock string `json:"ticker,omitempty"`
}
