# CryptoSwaps - Prototype UI Specification Document
## For Antigravity Development Team

---

## PROJECT OVERVIEW

### Product Name
**CryptoSwaps**

### Purpose
Create a functional prototype UI that showcases the complete navigation and user flow of a cross-chain token swap platform. This is a non-functional prototype (dummy data, no actual wallet connections) designed to demonstrate the user experience and interface navigation.

### Infrastructure
Built on **Sodax infrastructure**

### Reference
Based on NEAR Intents architecture and UX patterns (see attached: near-intents-user-flow.md)

---

## TECHNICAL STACK RECOMMENDATIONS

### Frontend Framework
- **React.js** with TypeScript (recommended)
- **Next.js** (alternative for better routing)
- **Vite** (alternative for faster development)

### UI Component Library
- **Tailwind CSS** for styling
- **shadcn/ui** or **Radix UI** for accessible components
- **Framer Motion** for animations and transitions

### State Management
- **React Context** or **Zustand** (lightweight state management)
- Not needed: Redux (overkill for prototype)

### Additional Libraries
- **react-router-dom** - Navigation and routing
- **react-hot-toast** - Toast notifications
- **lucide-react** - Icon library
- **recharts** - Charts for explorer analytics (optional)

---

## CORE REQUIREMENTS

### Functional Requirements

#### 1. Navigation Flow ✅
- All navigation elements must be fully functional
- All buttons must trigger appropriate UI changes
- Modal interactions must work smoothly
- No broken links or dead-end pages

#### 2. Dummy Data ✅
- Pre-populated token lists
- Mock wallet addresses and balances
- Simulated transaction history
- Fake quotes and exchange rates

#### 3. No Backend Integration ❌
- No actual wallet connections
- No real blockchain transactions
- No API calls to external services
- All data is hardcoded or generated client-side

#### 4. Responsive Design ✅
- Desktop (1920px, 1440px, 1280px)
- Tablet (768px, 1024px)
- Mobile (375px, 414px)

---

## SCREEN-BY-SCREEN SPECIFICATIONS

### 1. LANDING PAGE
**Route:** `/`

#### Components Needed:

##### Header/Navigation Bar
```typescript
<Header>
  <Logo /> // Links to home
  <NavLinks>
    <Link to="/swap">Swap</Link>
    <Link to="/explorer">Explorer</Link>
    <Link to="/docs">Docs</Link>
    <Link to="/about">About</Link>
  </NavLinks>
  <ConnectWalletButton /> // Triggers wallet modal
</Header>
```

##### Hero Section
```typescript
<HeroSection>
  <Heading>
    The Smartest Way to Trade Across Chains
  </Heading>
  <Subheading>
    Swap tokens seamlessly across Bitcoin, Ethereum, Solana, and more 
    using intent-based execution powered by Sodax
  </Subheading>
  <CTAButton onClick={() => navigate('/swap')}>
    Start Swapping
  </CTAButton>
  <SecondaryButton onClick={() => navigate('/docs')}>
    Learn More
  </SecondaryButton>
</HeroSection>
```

##### Features Section
```typescript
<FeaturesGrid>
  <FeatureCard icon="zap" title="Lightning Fast">
    Swaps complete in 2-3 seconds across all chains
  </FeatureCard>
  <FeatureCard icon="shield" title="Secure & Trustless">
    Your keys, your crypto. Non-custodial swaps.
  </FeatureCard>
  <FeatureCard icon="network" title="Cross-Chain">
    Trade BTC, ETH, SOL, DOGE, and 100+ tokens
  </FeatureCard>
  <FeatureCard icon="dollar-sign" title="Best Prices">
    Solvers compete to give you the best rate
  </FeatureCard>
</FeaturesGrid>
```

##### Supported Chains Section
```typescript
<SupportedChains>
  <ChainLogo chain="bitcoin" />
  <ChainLogo chain="ethereum" />
  <ChainLogo chain="solana" />
  <ChainLogo chain="polygon" />
  <ChainLogo chain="arbitrum" />
  <ChainLogo chain="near" />
  // Add more chains
</SupportedChains>
```

##### Footer
```typescript
<Footer>
  <FooterSection title="Product">
    <FooterLink to="/swap">Swap</FooterLink>
    <FooterLink to="/explorer">Explorer</FooterLink>
    <FooterLink to="/docs">Documentation</FooterLink>
  </FooterSection>
  <FooterSection title="Community">
    <FooterLink href="#">Twitter</FooterLink>
    <FooterLink href="#">Discord</FooterLink>
    <FooterLink href="#">GitHub</FooterLink>
  </FooterSection>
  <FooterSection title="Legal">
    <FooterLink to="/terms">Terms of Service</FooterLink>
    <FooterLink to="/privacy">Privacy Policy</FooterLink>
  </FooterSection>
  <PoweredBy>Powered by Sodax</PoweredBy>
</Footer>
```

---

### 2. SWAP INTERFACE
**Route:** `/swap`

This is the main application screen.

#### Layout Structure
```
┌─────────────────────────────────────────┐
│           Header (same as home)         │
├─────────────────────────────────────────┤
│                                         │
│         ┌─────────────────┐            │
│         │   Swap Widget   │            │
│         │                 │            │
│         │  [FROM Token]   │            │
│         │  [   Amount  ]  │            │
│         │                 │            │
│         │      ⇅ Flip     │            │
│         │                 │            │
│         │  [ TO Token  ]  │            │
│         │  [ Estimated ]  │            │
│         │                 │            │
│         │  [Quote Info]   │            │
│         │                 │            │
│         │  [Swap Button]  │            │
│         └─────────────────┘            │
│                                         │
└─────────────────────────────────────────┘
```

#### Swap Widget Component
```typescript
<SwapWidget>
  <SettingsButton onClick={openSettings} />
  
  <TokenInputSection type="from">
    <Label>From</Label>
    <TokenSelector onClick={() => openTokenModal('from')}>
      <TokenIcon src={selectedFromToken.icon} />
      <TokenSymbol>{selectedFromToken.symbol}</TokenSymbol>
      <ChevronDown />
    </TokenSelector>
    <AmountInput 
      value={fromAmount}
      onChange={handleAmountChange}
      placeholder="0.00"
    />
    <BalanceDisplay>
      Balance: {walletConnected ? '1.5 BTC' : '--'}
    </BalanceDisplay>
    <MaxButton onClick={setMaxAmount}>MAX</MaxButton>
  </TokenInputSection>

  <SwapDirectionButton onClick={flipTokens}>
    <ArrowDownUp />
  </SwapDirectionButton>

  <TokenInputSection type="to">
    <Label>To</Label>
    <TokenSelector onClick={() => openTokenModal('to')}>
      <TokenIcon src={selectedToToken.icon} />
      <TokenSymbol>{selectedToToken.symbol}</TokenSymbol>
      <ChevronDown />
    </TokenSelector>
    <AmountDisplay>
      {estimatedAmount || '0.00'}
    </AmountDisplay>
    <PriceImpact color={getPriceImpactColor()}>
      {priceImpact}% price impact
    </PriceImpact>
  </TokenInputSection>

  <QuoteInfoPanel>
    <QuoteRow>
      <Label>Rate</Label>
      <Value>1 {fromToken} = {exchangeRate} {toToken}</Value>
    </QuoteRow>
    <QuoteRow>
      <Label>Est. Time</Label>
      <Value>~2-3 seconds</Value>
    </QuoteRow>
    <QuoteRow>
      <Label>Network Fee</Label>
      <Value>$0.50</Value>
    </QuoteRow>
    <QuoteRow expandable onClick={toggleDetails}>
      <Label>Route <ChevronDown /></Label>
      <Value>Via Solver #42</Value>
    </QuoteRow>
  </QuoteInfoPanel>

  <ActionButton state={buttonState}>
    {getButtonText()} // "Connect Wallet", "Enter Amount", "Approve BTC", "Swap", etc.
  </ActionButton>
</SwapWidget>
```

#### Button States Logic
```typescript
enum ButtonState {
  CONNECT_WALLET = 'Connect Wallet',
  ENTER_AMOUNT = 'Enter Amount',
  INSUFFICIENT_BALANCE = 'Insufficient Balance',
  APPROVE_TOKEN = 'Approve {TOKEN}',
  SWAP = 'Swap',
  SWAPPING = 'Swapping...'
}

function getButtonState(): ButtonState {
  if (!walletConnected) return ButtonState.CONNECT_WALLET;
  if (!fromAmount || fromAmount === '0') return ButtonState.ENTER_AMOUNT;
  if (parseFloat(fromAmount) > balance) return ButtonState.INSUFFICIENT_BALANCE;
  if (!isTokenApproved(selectedFromToken)) return ButtonState.APPROVE_TOKEN;
  if (isSwapping) return ButtonState.SWAPPING;
  return ButtonState.SWAP;
}
```

#### Mock Data for Swap
```typescript
const MOCK_TOKENS = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    icon: '/tokens/btc.svg',
    chain: 'Bitcoin',
    balance: '1.5',
    usdValue: '63750.00'
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    icon: '/tokens/eth.svg',
    chain: 'Ethereum',
    balance: '10.2',
    usdValue: '20400.00'
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    icon: '/tokens/sol.svg',
    chain: 'Solana',
    balance: '500',
    usdValue: '15000.00'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    icon: '/tokens/usdc.svg',
    chain: 'Ethereum',
    balance: '5000',
    usdValue: '5000.00'
  },
  {
    symbol: 'USDT',
    name: 'Tether',
    icon: '/tokens/usdt.svg',
    chain: 'Ethereum',
    balance: '3000',
    usdValue: '3000.00'
  },
  // Add 15-20 more tokens
];
```

---

### 3. TOKEN SELECTION MODAL
**Triggered by:** Clicking token selector in swap widget

#### Component Structure
```typescript
<Modal isOpen={isTokenModalOpen} onClose={closeTokenModal}>
  <ModalHeader>
    <Title>Select a token</Title>
    <CloseButton onClick={closeTokenModal}>×</CloseButton>
  </ModalHeader>

  <SearchBar>
    <SearchIcon />
    <Input 
      placeholder="Search name or paste address"
      value={searchQuery}
      onChange={handleSearch}
    />
  </SearchBar>

  <PopularTokens>
    <Label>Popular</Label>
    <TokenChips>
      <TokenChip onClick={() => selectToken('BTC')}>
        <TokenIcon src="/tokens/btc.svg" />
        BTC
      </TokenChip>
      <TokenChip onClick={() => selectToken('ETH')}>
        <TokenIcon src="/tokens/eth.svg" />
        ETH
      </TokenChip>
      <TokenChip onClick={() => selectToken('USDC')}>
        <TokenIcon src="/tokens/usdc.svg" />
        USDC
      </TokenChip>
      // Add more popular tokens
    </TokenChips>
  </PopularTokens>

  <TokenList>
    {filteredTokens.map(token => (
      <TokenListItem 
        key={token.symbol}
        onClick={() => selectToken(token.symbol)}
      >
        <TokenInfo>
          <TokenIcon src={token.icon} />
          <div>
            <TokenSymbol>{token.symbol}</TokenSymbol>
            <TokenName>{token.name}</TokenName>
          </div>
        </TokenInfo>
        <TokenBalance>
          <Amount>{token.balance}</Amount>
          <UsdValue>${token.usdValue}</UsdValue>
        </TokenBalance>
        <ChainBadge>{token.chain}</ChainBadge>
      </TokenListItem>
    ))}
  </TokenList>
</Modal>
```

#### Search Functionality
```typescript
function handleSearch(query: string) {
  const filtered = MOCK_TOKENS.filter(token => 
    token.symbol.toLowerCase().includes(query.toLowerCase()) ||
    token.name.toLowerCase().includes(query.toLowerCase())
  );
  setFilteredTokens(filtered);
}
```

---

### 4. WALLET CONNECTION MODAL
**Triggered by:** Clicking "Connect Wallet" button

#### Component Structure
```typescript
<Modal isOpen={isWalletModalOpen} onClose={closeWalletModal}>
  <ModalHeader>
    <Title>Connect Wallet</Title>
    <CloseButton onClick={closeWalletModal}>×</CloseButton>
  </ModalHeader>

  <WalletOptions>
    <WalletOption onClick={() => connectWallet('metamask')}>
      <WalletIcon src="/wallets/metamask.svg" />
      <WalletName>MetaMask</WalletName>
      <PopularBadge>Popular</PopularBadge>
    </WalletOption>

    <WalletOption onClick={() => connectWallet('walletconnect')}>
      <WalletIcon src="/wallets/walletconnect.svg" />
      <WalletName>WalletConnect</WalletName>
    </WalletOption>

    <WalletOption onClick={() => connectWallet('coinbase')}>
      <WalletIcon src="/wallets/coinbase.svg" />
      <WalletName>Coinbase Wallet</WalletName>
    </WalletOption>

    <WalletOption onClick={() => connectWallet('phantom')}>
      <WalletIcon src="/wallets/phantom.svg" />
      <WalletName>Phantom</WalletName>
      <ChainBadge>Solana</ChainBadge>
    </WalletOption>

    <WalletOption onClick={() => connectWallet('near')}>
      <WalletIcon src="/wallets/near.svg" />
      <WalletName>NEAR Wallet</WalletName>
    </WalletOption>
  </WalletOptions>

  <DisclaimerText>
    By connecting a wallet, you agree to our Terms of Service
  </DisclaimerText>
</Modal>
```

#### Mock Wallet Connection
```typescript
function connectWallet(walletType: string) {
  // Simulate connection delay
  setIsConnecting(true);
  
  setTimeout(() => {
    // Set mock wallet data
    setWalletConnected(true);
    setWalletAddress('0x742d35Cc6634C0532925a3b844Bc454e4438f44e');
    setWalletType(walletType);
    
    // Show success toast
    toast.success('Wallet connected successfully!');
    
    // Close modal
    closeWalletModal();
    setIsConnecting(false);
  }, 1500);
}
```

---

### 5. SETTINGS MODAL
**Triggered by:** Clicking settings/gear icon in swap widget

#### Component Structure
```typescript
<Modal isOpen={isSettingsOpen} onClose={closeSettings}>
  <ModalHeader>
    <Title>Swap Settings</Title>
    <CloseButton onClick={closeSettings}>×</CloseButton>
  </ModalHeader>

  <SettingsSection>
    <SectionLabel>Slippage Tolerance</SectionLabel>
    <SlippageOptions>
      <SlippageButton 
        active={slippage === 0.5}
        onClick={() => setSlippage(0.5)}
      >
        0.5%
      </SlippageButton>
      <SlippageButton 
        active={slippage === 1}
        onClick={() => setSlippage(1)}
      >
        1%
      </SlippageButton>
      <SlippageButton 
        active={slippage === 2}
        onClick={() => setSlippage(2)}
      >
        2%
      </SlippageButton>
      <SlippageInput>
        <Input 
          value={customSlippage}
          onChange={handleCustomSlippage}
          placeholder="Custom"
        />
        <span>%</span>
      </SlippageInput>
    </SlippageOptions>
    {slippage > 5 && (
      <WarningBanner>
        High slippage tolerance. Your transaction may be frontrun.
      </WarningBanner>
    )}
  </SettingsSection>

  <SettingsSection>
    <SectionLabel>Transaction Deadline</SectionLabel>
    <DeadlineInput>
      <Input 
        value={deadline}
        onChange={handleDeadlineChange}
        type="number"
      />
      <span>minutes</span>
    </DeadlineInput>
    <HelperText>
      Transaction will revert if not completed within this time
    </HelperText>
  </SettingsSection>

  <SettingsSection>
    <SectionLabel>Swap Mode</SectionLabel>
    <RadioGroup value={swapMode} onChange={setSwapMode}>
      <RadioOption value="exact_input">
        <Radio checked={swapMode === 'exact_input'} />
        <div>
          <RadioLabel>Exact Input</RadioLabel>
          <RadioDescription>
            Specify exact input amount, receive approximate output
          </RadioDescription>
        </div>
      </RadioOption>
      <RadioOption value="exact_output">
        <Radio checked={swapMode === 'exact_output'} />
        <div>
          <RadioLabel>Exact Output</RadioLabel>
          <RadioDescription>
            Specify exact output amount, send approximate input
          </RadioDescription>
        </div>
      </RadioOption>
    </RadioGroup>
  </SettingsSection>

  <ButtonGroup>
    <SecondaryButton onClick={resetToDefaults}>
      Reset to Defaults
    </SecondaryButton>
    <PrimaryButton onClick={closeSettings}>
      Save
    </PrimaryButton>
  </ButtonGroup>
</Modal>
```

---

### 6. CONFIRM SWAP MODAL
**Triggered by:** Clicking "Swap" button

#### Component Structure
```typescript
<Modal isOpen={isConfirmModalOpen} onClose={closeConfirmModal}>
  <ModalHeader>
    <Title>Confirm Swap</Title>
    <CloseButton onClick={closeConfirmModal}>×</CloseButton>
  </ModalHeader>

  <SwapSummary>
    <FromSection>
      <Label>From</Label>
      <TokenAmount>
        <Amount>{fromAmount}</Amount>
        <TokenWithIcon>
          <TokenIcon src={fromToken.icon} />
          <TokenSymbol>{fromToken.symbol}</TokenSymbol>
        </TokenWithIcon>
      </TokenAmount>
      <ChainBadge>{fromToken.chain}</ChainBadge>
    </FromSection>

    <ArrowIcon>↓</ArrowIcon>

    <ToSection>
      <Label>To (estimated)</Label>
      <TokenAmount>
        <Amount>{estimatedToAmount}</Amount>
        <TokenWithIcon>
          <TokenIcon src={toToken.icon} />
          <TokenSymbol>{toToken.symbol}</TokenSymbol>
        </TokenWithIcon>
      </TokenAmount>
      <ChainBadge>{toToken.chain}</ChainBadge>
    </ToSection>
  </SwapSummary>

  <DetailsList>
    <DetailRow>
      <Label>Exchange Rate</Label>
      <Value>
        1 {fromToken.symbol} = {exchangeRate} {toToken.symbol}
      </Value>
    </DetailRow>
    <DetailRow>
      <Label>Price Impact</Label>
      <Value color={getPriceImpactColor()}>
        {priceImpact}%
      </Value>
    </DetailRow>
    <DetailRow>
      <Label>Minimum Received</Label>
      <Value>{minimumReceived} {toToken.symbol}</Value>
    </DetailRow>
    <DetailRow>
      <Label>Network Fee</Label>
      <Value>$0.50</Value>
    </DetailRow>
    <DetailRow>
      <Label>Estimated Time</Label>
      <Value>2-3 seconds</Value>
    </DetailRow>
    <DetailRow expandable>
      <Label>
        Deposit Address 
        <InfoIcon tooltip="Send tokens to this address" />
      </Label>
      <Value>
        <Address>bc1q...xyz123</Address>
        <CopyButton onClick={copyAddress} />
      </Value>
    </DetailRow>
    <DetailRow>
      <Label>Deadline</Label>
      <Value>{new Date(Date.now() + deadline * 60000).toLocaleString()}</Value>
    </DetailRow>
  </DetailsList>

  <WarningBanner severity="info">
    Output is estimated. You will receive at least {minimumReceived} {toToken.symbol} or the transaction will revert.
  </WarningBanner>

  <ButtonGroup>
    <SecondaryButton onClick={closeConfirmModal}>
      Cancel
    </SecondaryButton>
    <PrimaryButton onClick={executeSwap}>
      Confirm Swap
    </PrimaryButton>
  </ButtonGroup>
</Modal>
```

---

### 7. TRANSACTION PROGRESS MODAL
**Triggered by:** After clicking "Confirm Swap"

#### Component Structure
```typescript
<Modal 
  isOpen={isProgressModalOpen} 
  onClose={null} // Can't close during transaction
  showCloseButton={false}
>
  <ProgressSteps>
    <Step completed={step >= 1} active={step === 1}>
      <StepIcon>
        {step > 1 ? <CheckCircle /> : <Circle />}
      </StepIcon>
      <StepContent>
        <StepTitle>Depositing</StepTitle>
        <StepDescription>
          {step === 1 ? 'Sending tokens...' : 'Tokens sent'}
        </StepDescription>
        {step === 1 && <Spinner />}
      </StepContent>
    </Step>

    <Step completed={step >= 2} active={step === 2}>
      <StepIcon>
        {step > 2 ? <CheckCircle /> : <Circle />}
      </StepIcon>
      <StepContent>
        <StepTitle>Processing</StepTitle>
        <StepDescription>
          {step === 2 ? 'Solver executing swap...' : step > 2 ? 'Swap executed' : 'Waiting...'}
        </StepDescription>
        {step === 2 && (
          <>
            <Spinner />
            <CountdownTimer>~{timeRemaining}s</CountdownTimer>
          </>
        )}
      </StepContent>
    </Step>

    <Step completed={step >= 3} active={step === 3}>
      <StepIcon>
        {step > 3 ? <CheckCircle /> : <Circle />}
      </StepIcon>
      <StepContent>
        <StepTitle>Confirming</StepTitle>
        <StepDescription>
          {step === 3 ? 'Finalizing on chain...' : step > 3 ? 'Confirmed' : 'Waiting...'}
        </StepDescription>
        {step === 3 && <Spinner />}
      </StepContent>
    </Step>

    <Step completed={step >= 4} active={step === 4}>
      <StepIcon>
        {step >= 4 ? <CheckCircle /> : <Circle />}
      </StepIcon>
      <StepContent>
        <StepTitle>Complete</StepTitle>
        <StepDescription>
          {step === 4 ? 'Tokens received!' : 'Waiting...'}
        </StepDescription>
      </StepContent>
    </Step>
  </ProgressSteps>

  {step < 4 && (
    <TransactionDetails>
      <DetailRow>
        <Label>Transaction Hash</Label>
        <Value>
          <TxHash>0x742d...f44e</TxHash>
          <CopyButton />
        </Value>
      </DetailRow>
      <ViewOnExplorerLink href="#">
        View on Explorer →
      </ViewOnExplorerLink>
    </TransactionDetails>
  )}

  {step === 4 && (
    <SuccessContent>
      <SuccessIcon>✓</SuccessIcon>
      <SuccessTitle>Swap Completed!</SuccessTitle>
      <SuccessAmount>
        Received {receivedAmount} {toToken.symbol}
      </SuccessAmount>
      <ButtonGroup>
        <SecondaryButton onClick={viewOnExplorer}>
          View on Explorer
        </SecondaryButton>
        <PrimaryButton onClick={closeAndReset}>
          Done
        </PrimaryButton>
      </ButtonGroup>
    </SuccessContent>
  )}
</Modal>
```

#### Mock Transaction Flow
```typescript
async function executeSwap() {
  closeConfirmModal();
  openProgressModal();
  
  // Step 1: Depositing (2 seconds)
  setStep(1);
  await sleep(2000);
  
  // Step 2: Processing (3 seconds)
  setStep(2);
  setTimeRemaining(3);
  const countdown = setInterval(() => {
    setTimeRemaining(prev => prev - 1);
  }, 1000);
  await sleep(3000);
  clearInterval(countdown);
  
  // Step 3: Confirming (2 seconds)
  setStep(3);
  await sleep(2000);
  
  // Step 4: Complete
  setStep(4);
  setReceivedAmount(estimatedToAmount);
  
  // Add to transaction history
  addTransactionToHistory({
    hash: generateMockTxHash(),
    from: { token: fromToken.symbol, amount: fromAmount },
    to: { token: toToken.symbol, amount: receivedAmount },
    status: 'completed',
    timestamp: Date.now()
  });
}
```

---

### 8. EXPLORER PAGE
**Route:** `/explorer`

#### Layout
```typescript
<ExplorerPage>
  <Header /> // Same as other pages

  <PageHeader>
    <Title>Transaction Explorer</Title>
    <Subtitle>Track all CryptoSwaps transactions</Subtitle>
  </PageHeader>

  <FilterBar>
    <SearchInput>
      <SearchIcon />
      <Input 
        placeholder="Search by transaction hash or address"
        value={searchQuery}
        onChange={handleSearch}
      />
    </SearchInput>

    <FilterGroup>
      <TokenFilterDropdown
        value={selectedTokenFilter}
        onChange={setSelectedTokenFilter}
      >
        <option value="all">All Tokens</option>
        <option value="BTC">BTC</option>
        <option value="ETH">ETH</option>
        <option value="SOL">SOL</option>
        <option value="USDC">USDC</option>
        // More tokens
      </TokenFilterDropdown>

      <StatusFilterDropdown
        value={selectedStatusFilter}
        onChange={setSelectedStatusFilter}
      >
        <option value="all">All Status</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
        <option value="failed">Failed</option>
      </StatusFilterDropdown>

      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onChange={handleDateChange}
      />
    </FilterGroup>
  </FilterBar>

  <StatsCards>
    <StatCard>
      <StatLabel>Total Volume (24h)</StatLabel>
      <StatValue>$12,456,789</StatValue>
      <StatChange positive>+12.5%</StatChange>
    </StatCard>
    <StatCard>
      <StatLabel>Total Swaps (24h)</StatLabel>
      <StatValue>1,234</StatValue>
      <StatChange positive>+8.2%</StatChange>
    </StatCard>
    <StatCard>
      <StatLabel>Avg. Swap Time</StatLabel>
      <StatValue>2.3s</StatValue>
      <StatChange positive>-0.5s</StatChange>
    </StatCard>
    <StatCard>
      <StatLabel>Active Solvers</StatLabel>
      <StatValue>47</StatValue>
      <StatChange neutral>—</StatChange>
    </StatCard>
  </StatsCards>

  <TransactionTable>
    <TableHeader>
      <Column>Transaction</Column>
      <Column>From</Column>
      <Column>To</Column>
      <Column>Status</Column>
      <Column>Time</Column>
      <Column>Actions</Column>
    </TableHeader>

    <TableBody>
      {filteredTransactions.map(tx => (
        <TransactionRow key={tx.hash} onClick={() => openTxDetails(tx)}>
          <Cell>
            <TxHash>{tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}</TxHash>
            <CopyButton onClick={(e) => {
              e.stopPropagation();
              copyToClipboard(tx.hash);
            }} />
          </Cell>
          <Cell>
            <TokenAmount>
              <TokenIcon src={tx.from.token.icon} />
              {tx.from.amount} {tx.from.token.symbol}
            </TokenAmount>
            <ChainBadge>{tx.from.chain}</ChainBadge>
          </Cell>
          <Cell>
            <TokenAmount>
              <TokenIcon src={tx.to.token.icon} />
              {tx.to.amount} {tx.to.token.symbol}
            </TokenAmount>
            <ChainBadge>{tx.to.chain}</ChainBadge>
          </Cell>
          <Cell>
            <StatusBadge status={tx.status}>
              {tx.status}
            </StatusBadge>
          </Cell>
          <Cell>
            <TimeAgo timestamp={tx.timestamp} />
          </Cell>
          <Cell>
            <ViewDetailsButton onClick={(e) => {
              e.stopPropagation();
              openTxDetails(tx);
            }}>
              View Details →
            </ViewDetailsButton>
          </Cell>
        </TransactionRow>
      ))}
    </TableBody>
  </TransactionTable>

  <Pagination>
    <PaginationButton 
      onClick={goToPrevPage}
      disabled={currentPage === 1}
    >
      Previous
    </PaginationButton>
    <PageNumbers>
      {[1, 2, 3, 4, 5].map(page => (
        <PageNumber
          key={page}
          active={page === currentPage}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </PageNumber>
      ))}
    </PageNumbers>
    <PaginationButton 
      onClick={goToNextPage}
      disabled={currentPage === totalPages}
    >
      Next
    </PaginationButton>
  </Pagination>
</ExplorerPage>
```

#### Mock Transaction Data
```typescript
const MOCK_TRANSACTIONS = [
  {
    hash: '0x742d35cc6634c0532925a3b844bc454e4438f44e',
    from: {
      token: { symbol: 'BTC', icon: '/tokens/btc.svg' },
      amount: '0.5',
      chain: 'Bitcoin'
    },
    to: {
      token: { symbol: 'ETH', icon: '/tokens/eth.svg' },
      amount: '12.5',
      chain: 'Ethereum'
    },
    status: 'completed',
    timestamp: Date.now() - 300000, // 5 minutes ago
    solver: 'Solver #42',
    depositAddress: 'bc1q...xyz123',
    fee: '$0.50',
    executionTime: '2.3s'
  },
  // Generate 50+ mock transactions
];
```

---

### 9. TRANSACTION DETAILS MODAL
**Triggered by:** Clicking transaction row or "View Details"

#### Component Structure
```typescript
<Modal isOpen={isTxDetailsOpen} onClose={closeTxDetails}>
  <ModalHeader>
    <Title>Transaction Details</Title>
    <CloseButton onClick={closeTxDetails}>×</CloseButton>
  </ModalHeader>

  <StatusSection>
    <StatusIcon status={transaction.status} />
    <StatusText status={transaction.status}>
      {transaction.status === 'completed' ? 'Swap Completed' : 
       transaction.status === 'pending' ? 'Swap in Progress' :
       'Swap Failed'}
    </StatusText>
    <Timestamp>
      {formatDate(transaction.timestamp)}
    </Timestamp>
  </StatusSection>

  <SwapFlowDiagram>
    <FlowStep>
      <TokenDisplay>
        <TokenIcon src={transaction.from.token.icon} />
        <Amount>{transaction.from.amount}</Amount>
        <Symbol>{transaction.from.token.symbol}</Symbol>
      </TokenDisplay>
      <ChainBadge>{transaction.from.chain}</ChainBadge>
    </FlowStep>

    <FlowArrow>→</FlowArrow>

    <FlowStep>
      <SolverBadge>
        {transaction.solver}
      </SolverBadge>
    </FlowStep>

    <FlowArrow>→</FlowArrow>

    <FlowStep>
      <TokenDisplay>
        <TokenIcon src={transaction.to.token.icon} />
        <Amount>{transaction.to.amount}</Amount>
        <Symbol>{transaction.to.token.symbol}</Symbol>
      </TokenDisplay>
      <ChainBadge>{transaction.to.chain}</ChainBadge>
    </FlowStep>
  </SwapFlowDiagram>

  <DetailsList>
    <DetailRow>
      <Label>Transaction Hash</Label>
      <Value>
        <Hash>{transaction.hash}</Hash>
        <CopyButton onClick={() => copyHash(transaction.hash)} />
      </Value>
    </DetailRow>
    <DetailRow>
      <Label>Deposit Address</Label>
      <Value>
        <Address>{transaction.depositAddress}</Address>
        <CopyButton onClick={() => copyAddress(transaction.depositAddress)} />
      </Value>
    </DetailRow>
    <DetailRow>
      <Label>Exchange Rate</Label>
      <Value>
        1 {transaction.from.token.symbol} = {transaction.rate} {transaction.to.token.symbol}
      </Value>
    </DetailRow>
    <DetailRow>
      <Label>Network Fee</Label>
      <Value>{transaction.fee}</Value>
    </DetailRow>
    <DetailRow>
      <Label>Execution Time</Label>
      <Value>{transaction.executionTime}</Value>
    </DetailRow>
    <DetailRow>
      <Label>Solver</Label>
      <Value>{transaction.solver}</Value>
    </DetailRow>
    <DetailRow>
      <Label>Timestamp</Label>
      <Value>{formatFullDate(transaction.timestamp)}</Value>
    </DetailRow>
  </DetailsList>

  <ExternalLinks>
    <ExternalLink href="#">
      <ExternalLinkIcon />
      View on Bitcoin Explorer
    </ExternalLink>
    <ExternalLink href="#">
      <ExternalLinkIcon />
      View on Ethereum Explorer
    </ExternalLink>
  </ExternalLinks>

  <ActionButtons>
    <SecondaryButton onClick={closeTxDetails}>
      Close
    </SecondaryButton>
    <PrimaryButton onClick={shareTransaction}>
      <ShareIcon />
      Share
    </PrimaryButton>
  </ActionButtons>
</Modal>
```

---

### 10. WALLET CONNECTED STATE (Header)

#### Component When Wallet is Connected
```typescript
<WalletConnectedSection>
  <NetworkIndicator>
    <NetworkDot color="green" />
    <NetworkName>Ethereum</NetworkName>
  </NetworkIndicator>

  <BalanceDisplay onClick={toggleBalanceDropdown}>
    <BalanceAmount>$25,150.00</BalanceAmount>
    <ChevronDown />
  </BalanceDisplay>

  <WalletAddressButton onClick={toggleWalletDropdown}>
    <WalletAvatar address={walletAddress} />
    <AddressTruncated>
      {truncateAddress(walletAddress)}
    </AddressTruncated>
    <ChevronDown />
  </WalletAddressButton>

  {/* Dropdown Menu */}
  {isWalletDropdownOpen && (
    <WalletDropdown>
      <DropdownSection>
        <AddressFull>{walletAddress}</AddressFull>
        <CopyButton onClick={copyAddress}>
          Copy Address
        </CopyButton>
      </DropdownSection>

      <DropdownDivider />

      <DropdownSection>
        <DropdownItem onClick={viewOnExplorer}>
          <ExplorerIcon />
          View on Explorer
        </DropdownItem>
        <DropdownItem onClick={viewTransactions}>
          <HistoryIcon />
          Transaction History
        </DropdownItem>
      </DropdownSection>

      <DropdownDivider />

      <DropdownSection>
        <DisconnectButton onClick={disconnectWallet}>
          <DisconnectIcon />
          Disconnect
        </DisconnectButton>
      </DropdownSection>
    </WalletDropdown>
  )}
</WalletConnectedSection>
```

---

### 11. ADDITIONAL PAGES (Simple Static Pages)

#### About Page (`/about`)
```typescript
<AboutPage>
  <Header />
  <PageContent>
    <Hero>
      <Title>About CryptoSwaps</Title>
      <Subtitle>
        The most advanced cross-chain swap protocol powered by Sodax
      </Subtitle>
    </Hero>

    <ContentSection>
      <Heading>What is CryptoSwaps?</Heading>
      <Paragraph>
        CryptoSwaps is a revolutionary cross-chain token swap platform...
      </Paragraph>
    </ContentSection>

    <ContentSection>
      <Heading>How It Works</Heading>
      <StepsList>
        <Step number={1}>
          <StepTitle>Express Your Intent</StepTitle>
          <StepDescription>
            Simply specify what tokens you want to swap
          </StepDescription>
        </Step>
        <Step number={2}>
          <StepTitle>Solvers Compete</StepTitle>
          <StepDescription>
            Multiple solvers compete to give you the best rate
          </StepDescription>
        </Step>
        <Step number={3}>
          <StepTitle>Instant Settlement</StepTitle>
          <StepDescription>
            Receive your tokens in 2-3 seconds
          </StepDescription>
        </Step>
      </StepsList>
    </ContentSection>

    <ContentSection>
      <Heading>Powered by Sodax</Heading>
      <SodaxInfo>
        <SodaxLogo />
        <Paragraph>
          Built on Sodax infrastructure for maximum security and efficiency
        </Paragraph>
      </SodaxInfo>
    </ContentSection>
  </PageContent>
  <Footer />
</AboutPage>
```

#### Docs Page (`/docs`)
```typescript
<DocsPage>
  <Header />
  <DocsLayout>
    <Sidebar>
      <SidebarSection title="Getting Started">
        <SidebarLink to="/docs#introduction">Introduction</SidebarLink>
        <SidebarLink to="/docs#quick-start">Quick Start</SidebarLink>
        <SidebarLink to="/docs#how-it-works">How It Works</SidebarLink>
      </SidebarSection>
      <SidebarSection title="Features">
        <SidebarLink to="/docs#swapping">Swapping Tokens</SidebarLink>
        <SidebarLink to="/docs#wallets">Supported Wallets</SidebarLink>
        <SidebarLink to="/docs#chains">Supported Chains</SidebarLink>
      </SidebarSection>
      <SidebarSection title="Advanced">
        <SidebarLink to="/docs#slippage">Slippage Settings</SidebarLink>
        <SidebarLink to="/docs#intents">How Intents Work</SidebarLink>
        <SidebarLink to="/docs#solvers">About Solvers</SidebarLink>
      </SidebarSection>
    </Sidebar>

    <DocsContent>
      {/* Scrollable documentation content */}
      <DocSection id="introduction">
        <Heading>Introduction</Heading>
        <Paragraph>Welcome to CryptoSwaps...</Paragraph>
      </DocSection>
      {/* More sections */}
    </DocsContent>
  </DocsLayout>
  <Footer />
</DocsPage>
```

---

## STATE MANAGEMENT STRUCTURE

### Global State (Context/Zustand)
```typescript
interface AppState {
  // Wallet State
  walletConnected: boolean;
  walletAddress: string | null;
  walletType: string | null;
  
  // Token Selection
  selectedFromToken: Token | null;
  selectedToToken: Token | null;
  fromAmount: string;
  estimatedToAmount: string;
  
  // Swap Settings
  slippage: number;
  deadline: number;
  swapMode: 'exact_input' | 'exact_output';
  
  // UI State
  isWalletModalOpen: boolean;
  isTokenModalOpen: boolean;
  tokenModalType: 'from' | 'to' | null;
  isSettingsOpen: boolean;
  isConfirmModalOpen: boolean;
  isProgressModalOpen: boolean;
  isTxDetailsOpen: boolean;
  
  // Transaction State
  transactions: Transaction[];
  currentTransaction: Transaction | null;
  transactionStep: number;
  
  // Actions
  connectWallet: (type: string) => void;
  disconnectWallet: () => void;
  selectToken: (token: Token, type: 'from' | 'to') => void;
  setAmount: (amount: string) => void;
  flipTokens: () => void;
  executeSwap: () => Promise<void>;
  // ... more actions
}
```

---

## COMPONENT HIERARCHY

```
App
├── Header
│   ├── Logo
│   ├── Navigation
│   │   ├── NavLink (Swap)
│   │   ├── NavLink (Explorer)
│   │   ├── NavLink (Docs)
│   │   └── NavLink (About)
│   └── WalletSection
│       ├── ConnectWalletButton (when disconnected)
│       └── WalletConnected (when connected)
│           ├── NetworkIndicator
│           ├── BalanceDisplay
│           ├── WalletAddress
│           └── WalletDropdown
│
├── Routes
│   ├── HomePage
│   │   ├── HeroSection
│   │   ├── FeaturesSection
│   │   ├── SupportedChainsSection
│   │   └── CTASection
│   │
│   ├── SwapPage
│   │   └── SwapWidget
│   │       ├── SettingsButton
│   │       ├── TokenInputSection (From)
│   │       │   ├── TokenSelector
│   │       │   ├── AmountInput
│   │       │   ├── BalanceDisplay
│   │       │   └── MaxButton
│   │       ├── SwapDirectionButton
│   │       ├── TokenInputSection (To)
│   │       │   ├── TokenSelector
│   │       │   └── AmountDisplay
│   │       ├── QuoteInfoPanel
│   │       └── ActionButton
│   │
│   ├── ExplorerPage
│   │   ├── PageHeader
│   │   ├── FilterBar
│   │   │   ├── SearchInput
│   │   │   ├── TokenFilter
│   │   │   ├── StatusFilter
│   │   │   └── DateRangePicker
│   │   ├── StatsCards
│   │   ├── TransactionTable
│   │   └── Pagination
│   │
│   ├── AboutPage
│   └── DocsPage
│
├── Modals
│   ├── WalletConnectionModal
│   ├── TokenSelectionModal
│   ├── SettingsModal
│   ├── ConfirmSwapModal
│   ├── TransactionProgressModal
│   └── TransactionDetailsModal
│
└── Footer
    ├── FooterLinks
    └── SocialLinks
```

---

## STYLING GUIDELINES

### Color Palette
```css
/* Primary Colors */
--primary: #6366f1; /* Indigo */
--primary-hover: #4f46e5;
--primary-light: #818cf8;

/* Secondary Colors */
--secondary: #8b5cf6; /* Purple */
--secondary-hover: #7c3aed;

/* Accent Colors */
--accent: #10b981; /* Green for success */
--warning: #f59e0b; /* Amber for warnings */
--error: #ef4444; /* Red for errors */

/* Neutral Colors */
--bg-primary: #0f172a; /* Dark blue-gray */
--bg-secondary: #1e293b;
--bg-tertiary: #334155;
--text-primary: #f8fafc;
--text-secondary: #cbd5e1;
--text-muted: #64748b;
--border: #334155;

/* Status Colors */
--status-completed: #10b981;
--status-pending: #f59e0b;
--status-failed: #ef4444;
```

### Typography
```css
/* Font Family */
--font-primary: 'Inter', -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Courier New', monospace;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing
```css
/* Consistent spacing scale */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
```

### Border Radius
```css
--radius-sm: 0.375rem;  /* 6px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1rem;      /* 16px */
--radius-full: 9999px;  /* Full circle */
```

### Shadows
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

---

## ANIMATIONS & TRANSITIONS

### Standard Transitions
```css
/* Button hover */
transition: all 0.2s ease;

/* Modal open/close */
transition: opacity 0.3s ease, transform 0.3s ease;

/* Dropdown */
transition: max-height 0.3s ease, opacity 0.2s ease;
```

### Loading States
```typescript
// Spinner component
<Spinner className="animate-spin" />

// Skeleton loaders for data loading
<SkeletonLoader />

// Shimmer effect
<ShimmerEffect />
```

### Micro-interactions
```typescript
// Toast notifications
toast.success('Copied to clipboard!', {
  duration: 2000,
  icon: '✓'
});

// Button press effect
<button className="active:scale-95 transition-transform">

// Hover effects on cards
<div className="hover:shadow-lg hover:scale-105 transition-all">
```

---

## RESPONSIVE BREAKPOINTS

```css
/* Tailwind-style breakpoints */
--breakpoint-sm: 640px;   /* Mobile landscape */
--breakpoint-md: 768px;   /* Tablet */
--breakpoint-lg: 1024px;  /* Desktop */
--breakpoint-xl: 1280px;  /* Large desktop */
--breakpoint-2xl: 1536px; /* Extra large */
```

### Mobile Adaptations
- Stack swap widget sections vertically
- Hamburger menu for navigation
- Bottom sheets for modals
- Simplified transaction table (cards instead of table)
- Full-width buttons
- Larger touch targets (min 44x44px)

---

## ACCESSIBILITY REQUIREMENTS

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Tab order must be logical
- Focus indicators must be visible
- Escape key closes modals
- Enter key activates buttons

### ARIA Labels
```typescript
<button aria-label="Connect wallet">
<input aria-label="Token amount" />
<div role="dialog" aria-modal="true">
<div role="status" aria-live="polite"> // For toast notifications
```

### Screen Reader Support
- Semantic HTML (header, nav, main, footer)
- Alt text for all images/icons
- Descriptive link text (avoid "click here")
- Form labels associated with inputs

---

## MOCK DATA GENERATION

### Helper Functions
```typescript
// Generate random transaction hash
function generateTxHash(): string {
  return '0x' + Array.from({ length: 40 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

// Generate random amount
function generateRandomAmount(min: number, max: number): string {
  return (Math.random() * (max - min) + min).toFixed(4);
}

// Generate random timestamp (last 7 days)
function generateRandomTimestamp(): number {
  const now = Date.now();
  const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
  return Math.floor(Math.random() * (now - sevenDaysAgo) + sevenDaysAgo);
}

// Generate mock transactions
function generateMockTransactions(count: number): Transaction[] {
  const tokens = ['BTC', 'ETH', 'SOL', 'USDC', 'USDT'];
  const statuses = ['completed', 'pending', 'failed'];
  
  return Array.from({ length: count }, () => ({
    hash: generateTxHash(),
    from: {
      token: getRandomToken(),
      amount: generateRandomAmount(0.1, 10),
      chain: 'Ethereum'
    },
    to: {
      token: getRandomToken(),
      amount: generateRandomAmount(0.1, 10),
      chain: 'Ethereum'
    },
    status: statuses[Math.floor(Math.random() * statuses.length)],
    timestamp: generateRandomTimestamp(),
    solver: `Solver #${Math.floor(Math.random() * 100)}`,
    fee: `$${(Math.random() * 5).toFixed(2)}`
  }));
}
```

---

## TOAST NOTIFICATIONS SYSTEM

### Implementation
```typescript
import toast from 'react-hot-toast';

// Success notifications
toast.success('Wallet connected successfully!');
toast.success('Transaction completed!');
toast.success('Copied to clipboard!');

// Error notifications
toast.error('Failed to connect wallet');
toast.error('Insufficient balance');
toast.error('Transaction failed');

// Info notifications
toast('Quote refreshed', { icon: 'ℹ️' });
toast.loading('Processing transaction...');

// Custom styled toast
toast.custom((t) => (
  <div className={`notification ${t.visible ? 'animate-enter' : 'animate-leave'}`}>
    <div className="notification-content">
      {/* Custom content */}
    </div>
  </div>
));
```

---

## ERROR HANDLING

### Error States to Implement

1. **Network Errors**
   - Show error message
   - Provide retry button
   - Don't block UI

2. **Validation Errors**
   - Inline field validation
   - Clear error messages
   - Highlight problematic fields

3. **Transaction Errors**
   - Show in progress modal
   - Provide details about failure
   - Offer retry or cancel options

4. **404 Page**
   ```typescript
   <NotFoundPage>
     <ErrorCode>404</ErrorCode>
     <ErrorMessage>Page not found</ErrorMessage>
     <BackButton onClick={() => navigate('/')}>
       Go Home
     </BackButton>
   </NotFoundPage>
   ```

---

## PERFORMANCE CONSIDERATIONS

### Optimization Strategies

1. **Lazy Loading**
   ```typescript
   const ExplorerPage = lazy(() => import('./pages/Explorer'));
   const DocsPage = lazy(() => import('./pages/Docs'));
   ```

2. **Memoization**
   ```typescript
   const MemoizedTokenList = memo(TokenList);
   const cachedCalculation = useMemo(() => calculateQuote(), [deps]);
   ```

3. **Debouncing**
   ```typescript
   // Debounce search input
   const debouncedSearch = useDebounce(searchQuery, 300);
   ```

4. **Virtual Scrolling**
   - For long transaction lists
   - Use react-window or react-virtual

---

## ASSETS NEEDED

### Icons/Images
```
/public/
  /tokens/
    btc.svg
    eth.svg
    sol.svg
    usdc.svg
    usdt.svg
    bnb.svg
    matic.svg
    avax.svg
    doge.svg
    ... (20+ token icons)
  
  /wallets/
    metamask.svg
    walletconnect.svg
    coinbase.svg
    phantom.svg
    near.svg
  
  /chains/
    ethereum.svg
    bitcoin.svg
    solana.svg
    polygon.svg
    arbitrum.svg
    
  /logos/
    cryptoswaps-logo.svg
    sodax-logo.svg
    
  /icons/ (use lucide-react instead)
```

### Where to Get Assets
- **Token Icons:** CoinGecko API or crypto-icons library
- **Wallet Icons:** Official brand assets
- **UI Icons:** Lucide React (built-in)
- **Chain Logos:** Official brand assets

---

## PROJECT STRUCTURE

```
cryptoswaps/
├── public/
│   ├── tokens/
│   ├── wallets/
│   ├── chains/
│   └── logos/
│
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   └── Spinner.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── swap/
│   │   │   ├── SwapWidget.tsx
│   │   │   ├── TokenInputSection.tsx
│   │   │   ├── QuoteInfoPanel.tsx
│   │   │   └── ActionButton.tsx
│   │   ├── modals/
│   │   │   ├── WalletConnectionModal.tsx
│   │   │   ├── TokenSelectionModal.tsx
│   │   │   ├── SettingsModal.tsx
│   │   │   ├── ConfirmSwapModal.tsx
│   │   │   ├── TransactionProgressModal.tsx
│   │   │   └── TransactionDetailsModal.tsx
│   │   └── explorer/
│   │       ├── FilterBar.tsx
│   │       ├── TransactionTable.tsx
│   │       ├── StatsCards.tsx
│   │       └── Pagination.tsx
│   │
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── SwapPage.tsx
│   │   ├── ExplorerPage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── DocsPage.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── hooks/
│   │   ├── useWallet.ts
│   │   ├── useSwap.ts
│   │   ├── useTransactions.ts
│   │   └── useDebounce.ts
│   │
│   ├── store/
│   │   └── appStore.ts (Zustand store)
│   │
│   ├── utils/
│   │   ├── mockData.ts
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── helpers.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   └── variables.css
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

## TESTING SCENARIOS

### Manual Testing Checklist

#### Navigation Flow
- [ ] All nav links work correctly
- [ ] Logo returns to homepage
- [ ] Browser back/forward buttons work
- [ ] Direct URL navigation works

#### Wallet Connection
- [ ] Connect wallet modal opens
- [ ] All wallet options clickable
- [ ] Mock connection completes (1.5s delay)
- [ ] Wallet address displays correctly
- [ ] Disconnect works
- [ ] Wallet dropdown menu functions

#### Token Swap Flow
- [ ] Token selection opens modal
- [ ] Search filters tokens
- [ ] Popular tokens quick-select works
- [ ] Amount input accepts numbers
- [ ] MAX button fills balance
- [ ] Flip button swaps tokens
- [ ] Quote updates when amount changes
- [ ] Settings modal opens and saves
- [ ] Button states change correctly:
  - [ ] "Connect Wallet" when disconnected
  - [ ] "Enter Amount" when no amount
  - [ ] "Insufficient Balance" when amount > balance
  - [ ] "Approve Token" when needed
  - [ ] "Swap" when ready
- [ ] Confirm modal shows correct details
- [ ] Progress modal animates through steps
- [ ] Success state shows correctly
- [ ] Transaction added to history

#### Explorer
- [ ] Transaction table loads
- [ ] Search filters work
- [ ] Token filter works
- [ ] Status filter works
- [ ] Date picker works
- [ ] Pagination works
- [ ] Click transaction opens details
- [ ] Copy buttons work
- [ ] Stats cards display correctly

#### Responsive Design
- [ ] Mobile navigation (hamburger menu)
- [ ] Tablet layout
- [ ] Desktop layout
- [ ] All modals responsive
- [ ] Touch targets adequate on mobile

#### Accessibility
- [ ] Tab navigation works
- [ ] Focus indicators visible
- [ ] Escape closes modals
- [ ] Screen reader announces changes
- [ ] All buttons have labels

---

## DEPLOYMENT NOTES

### Build Command
```bash
npm run build
# or
yarn build
# or
pnpm build
```

### Environment Variables
```env
# Not needed for prototype, but for future reference
VITE_API_URL=https://api.cryptoswaps.com
VITE_SODAX_NETWORK=mainnet
```

### Hosting Recommendations
- **Vercel** (recommended for Next.js)
- **Netlify** (good for React/Vite)
- **GitHub Pages** (free option)

---

## FUTURE ENHANCEMENTS (Out of Scope for Prototype)

These features should NOT be built now, but are documented for future reference:

1. **Real Wallet Integration**
   - Actual Web3 connections
   - Real balance fetching
   - Transaction signing

2. **Live Price Feeds**
   - CoinGecko API integration
   - Real-time price updates
   - Historical price charts

3. **Backend API**
   - Transaction persistence
   - User accounts
   - Transaction history storage

4. **Advanced Features**
   - Limit orders
   - DCA strategies
   - Portfolio tracking
   - Price alerts

---

## DELIVERABLES CHECKLIST

### What Antigravity Should Deliver:

- [ ] Fully functional prototype with all screens
- [ ] All navigation working
- [ ] All modals/dialogs functional
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Mock data for all features
- [ ] Smooth animations and transitions
- [ ] Toast notifications working
- [ ] Clean, commented code
- [ ] README with setup instructions
- [ ] Deployed demo link (optional but recommended)

### What Should NOT Be Included:

- [ ] ❌ Real wallet connections
- [ ] ❌ Real blockchain transactions
- [ ] ❌ Backend API calls
- [ ] ❌ Database integration
- [ ] ❌ User authentication
- [ ] ❌ Live price feeds

---

## TIMELINE ESTIMATE

### Suggested Development Phases:

**Phase 1 (Days 1-2): Setup & Core UI**
- Project setup
- Design system implementation
- Header/Footer/Navigation
- Basic routing

**Phase 2 (Days 3-5): Main Features**
- Swap widget UI
- Token selection modal
- Wallet connection modal
- Settings modal

**Phase 3 (Days 6-7): Transaction Flow**
- Confirm swap modal
- Progress modal
- Success/error states
- Mock transaction execution

**Phase 4 (Days 8-9): Explorer**
- Transaction table
- Filters and search
- Transaction details modal
- Pagination

**Phase 5 (Days 10-11): Polish**
- Responsive design
- Animations/transitions
- Toast notifications
- Bug fixes

**Phase 6 (Day 12): Testing & Deployment**
- Manual testing
- Bug fixes
- Deployment
- Documentation

**Total Estimated Time: 10-12 working days**

---

## SUPPORT & QUESTIONS

### Key Points to Communicate to Antigravity:

1. **This is a prototype** - No real functionality needed, just UI/UX showcase
2. **All data is mock** - Hardcoded or randomly generated
3. **Focus on navigation** - Every button and link should work
4. **Mobile-first** - Should look great on all devices
5. **Clean code** - Well-structured and commented
6. **Sodax branding** - Include "Powered by Sodax" messaging

### Contact Points:
If Antigravity has questions about:
- **Design decisions** → Refer to NEAR Intents reference
- **Specific features** → This spec document
- **Technical choices** → Their discretion (within recommended stack)
- **Scope clarification** → Confirm prototype-only, no real functionality

---

## CONCLUSION

This specification provides Antigravity with everything needed to build a fully functional CryptoSwaps prototype UI. The prototype will demonstrate the complete user experience and navigation flow of a cross-chain token swap platform powered by Sodax infrastructure, without requiring any actual blockchain integration.

**Key Success Criteria:**
1. ✅ All screens accessible and functional
2. ✅ All buttons and links work
3. ✅ Smooth, professional UX
4. ✅ Responsive on all devices
5. ✅ Clean, maintainable code
6. ✅ Ready to showcase to stakeholders

---

**Document Version:** 1.0  
**Created:** January 2026  
**For:** Antigravity Development Team  
**Project:** CryptoSwaps Prototype UI
