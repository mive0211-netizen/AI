// 관리자 대시보드 스크립트
let applications = [];
let selectedApplications = new Set();

// 로그인 상태 확인
function checkLogin() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
        alert('관리자 로그인이 필요합니다.');
        window.location.href = 'admin-login.html';
        return false;
    }
    return true;
}

// 로그아웃 함수
function logout() {
    if (confirm('로그아웃하시겠습니까?')) {
        sessionStorage.removeItem('adminLoggedIn');
        window.location.href = 'admin-login.html';
    }
}

// 페이지 로드 시 로그인 확인 및 데이터 불러오기
document.addEventListener('DOMContentLoaded', function() {
    if (checkLogin()) {
        loadApplications();
        setupEventListeners();
    }
});

// 이벤트 리스너 설정
function setupEventListeners() {
    // 전체 선택 체크박스
    document.getElementById('selectAll').addEventListener('change', function() {
        const isChecked = this.checked;
        selectedApplications.clear();
        
        if (isChecked) {
            applications.forEach(app => selectedApplications.add(app.id));
        }
        
        updateCheckboxes();
        updateBulkDeleteButton();
    });
}

// 신청 데이터 불러오기
async function loadApplications() {
    try {
        const snapshot = await db.collection('applications')
            .orderBy('timestamp', 'desc')
            .get();
        
        applications = [];
        snapshot.forEach(doc => {
            applications.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        updateStats();
        renderApplications();
    } catch (error) {
        console.error('데이터 불러오기 실패:', error);
        document.getElementById('applicationsTable').innerHTML = 
            '<div class="no-data">데이터를 불러오는 중 오류가 발생했습니다.</div>';
        document.getElementById('applicationsCards').innerHTML = 
            '<div class="no-data">데이터를 불러오는 중 오류가 발생했습니다.</div>';
    }
}

// 통계 업데이트
function updateStats() {
    const total = applications.length;
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const todayApps = applications.filter(app => {
        const appDate = app.timestamp.toDate();
        return appDate >= todayStart;
    }).length;
    
    const weekApps = applications.filter(app => {
        const appDate = app.timestamp.toDate();
        return appDate >= weekStart;
    }).length;
    
    const newApps = applications.filter(app => !app.reviewed).length;
    
    document.getElementById('totalApplications').textContent = total;
    document.getElementById('newApplications').textContent = newApps;
    document.getElementById('todayApplications').textContent = todayApps;
    document.getElementById('thisWeekApplications').textContent = weekApps;
}

// 신청 목록 렌더링 (테이블 + 카드)
function renderApplications() {
    renderApplicationsTable();
    renderApplicationsCards();
}

// 데스크톱 테이블 렌더링
function renderApplicationsTable() {
    const tableContainer = document.getElementById('applicationsTable');
    
    if (applications.length === 0) {
        tableContainer.innerHTML = '<div class="no-data">아직 신청된 데이터가 없습니다.</div>';
        return;
    }
    
    let tableHTML = `
        <table class="applications-table">
            <thead>
                <tr>
                    <th class="checkbox-cell">
                        <input type="checkbox" id="selectAllTable" class="select-all-checkbox">
                    </th>
                    <th class="date-cell">신청일시</th>
                    <th class="name-cell">이름</th>
                    <th class="email-cell">이메일</th>
                    <th class="phone-cell">휴대폰</th>
                    <th class="motivation-cell">신청 동기</th>
                    <th class="status-cell">상태</th>
                    <th class="action-cell">작업</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    applications.forEach(app => {
        const date = app.timestamp.toDate().toLocaleString('ko-KR');
        const status = app.reviewed ? '검토완료' : '신규';
        const statusClass = app.reviewed ? 'status-reviewed' : 'status-new';
        const isChecked = selectedApplications.has(app.id);
        
        tableHTML += `
            <tr>
                <td class="checkbox-cell">
                    <input type="checkbox" class="application-checkbox" 
                           value="${app.id}" ${isChecked ? 'checked' : ''} 
                           onchange="toggleSelection('${app.id}')">
                </td>
                <td class="date-cell">${date}</td>
                <td class="name-cell">${app.name}</td>
                <td class="email-cell">${app.email}</td>
                <td class="phone-cell">${app.phone}</td>
                <td class="motivation-cell">${app.motivation.substring(0, 50)}${app.motivation.length > 50 ? '...' : ''}</td>
                <td class="status-cell"><span class="status-badge ${statusClass}">${status}</span></td>
                <td class="action-cell">
                    <button class="action-btn btn-view" onclick="viewDetail('${app.id}')">상세보기</button>
                    <button class="action-btn btn-delete" onclick="deleteApplication('${app.id}')">삭제</button>
                </td>
            </tr>
        `;
    });
    
    tableHTML += `
            </tbody>
        </table>
    `;
    
    tableContainer.innerHTML = tableHTML;
    
    // 테이블의 전체 선택 체크박스 이벤트 리스너
    const selectAllTable = document.getElementById('selectAllTable');
    if (selectAllTable) {
        selectAllTable.addEventListener('change', function() {
            const isChecked = this.checked;
            selectedApplications.clear();
            
            if (isChecked) {
                applications.forEach(app => selectedApplications.add(app.id));
            }
            
            updateCheckboxes();
            updateBulkDeleteButton();
        });
    }
}

// 모바일 카드 렌더링
function renderApplicationsCards() {
    const cardsContainer = document.getElementById('applicationsCards');
    
    if (applications.length === 0) {
        cardsContainer.innerHTML = '<div class="no-data">아직 신청된 데이터가 없습니다.</div>';
        return;
    }
    
    let cardsHTML = '';
    
    applications.forEach(app => {
        const date = app.timestamp.toDate().toLocaleString('ko-KR');
        const status = app.reviewed ? '검토완료' : '신규';
        const statusClass = app.reviewed ? 'status-reviewed' : 'status-new';
        const isChecked = selectedApplications.has(app.id);
        
        cardsHTML += `
            <div class="application-card">
                <input type="checkbox" class="card-checkbox" 
                       value="${app.id}" ${isChecked ? 'checked' : ''} 
                       onchange="toggleSelection('${app.id}')">
                <div class="card-content">
                    <div class="card-header">
                        <div class="card-name">${app.name}</div>
                        <span class="status-badge ${statusClass}">${status}</span>
                    </div>
                    <div class="card-info">
                        <span>📧 ${app.email}</span>
                        <span>📱 ${app.phone}</span>
                        <span>📅 ${date}</span>
                    </div>
                    <div class="card-motivation">${app.motivation}</div>
                    <div class="card-actions">
                        <button class="card-action-btn btn-view" onclick="viewDetail('${app.id}')">상세보기</button>
                        <button class="card-action-btn btn-delete" onclick="deleteApplication('${app.id}')">삭제</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    cardsContainer.innerHTML = cardsHTML;
}

// 선택 상태 토글
function toggleSelection(appId) {
    if (selectedApplications.has(appId)) {
        selectedApplications.delete(appId);
    } else {
        selectedApplications.add(appId);
    }
    
    updateCheckboxes();
    updateBulkDeleteButton();
}

// 체크박스 상태 업데이트
function updateCheckboxes() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const selectAllTableCheckbox = document.getElementById('selectAllTable');
    
    // 전체 선택 체크박스 상태 업데이트
    const allSelected = applications.length > 0 && selectedApplications.size === applications.length;
    const someSelected = selectedApplications.size > 0;
    
    if (selectAllCheckbox) {
        selectAllCheckbox.checked = allSelected;
        selectAllCheckbox.indeterminate = someSelected && !allSelected;
    }
    
    if (selectAllTableCheckbox) {
        selectAllTableCheckbox.checked = allSelected;
        selectAllTableCheckbox.indeterminate = someSelected && !allSelected;
    }
}

// 일괄 삭제 버튼 상태 업데이트
function updateBulkDeleteButton() {
    const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
    const hasSelection = selectedApplications.size > 0;
    
    bulkDeleteBtn.disabled = !hasSelection;
    bulkDeleteBtn.textContent = `선택 삭제 (${selectedApplications.size})`;
}

// 선택된 항목 삭제
async function deleteSelected() {
    if (selectedApplications.size === 0) {
        alert('삭제할 항목을 선택해주세요.');
        return;
    }
    
    const count = selectedApplications.size;
    if (!confirm(`선택된 ${count}개의 신청을 삭제하시겠습니까?`)) {
        return;
    }
    
    try {
        const deletePromises = Array.from(selectedApplications).map(appId => 
            db.collection('applications').doc(appId).delete()
        );
        
        await Promise.all(deletePromises);
        
        // 로컬 데이터에서 제거
        applications = applications.filter(app => !selectedApplications.has(app.id));
        selectedApplications.clear();
        
        updateStats();
        renderApplications();
        updateBulkDeleteButton();
        
        alert(`${count}개의 신청이 삭제되었습니다.`);
    } catch (error) {
        console.error('일괄 삭제 실패:', error);
        alert('삭제 중 오류가 발생했습니다.');
    }
}

// 상세 보기 모달 열기
function viewDetail(appId) {
    const app = applications.find(a => a.id === appId);
    if (!app) return;
    
    const modal = document.getElementById('detailModal');
    const content = document.getElementById('detailContent');
    
    const date = app.timestamp.toDate().toLocaleString('ko-KR');
    const status = app.reviewed ? '검토완료' : '신규';
    
    content.innerHTML = `
        <div class="detail-row">
            <div class="detail-label">신청일시:</div>
            <div class="detail-value">${date}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">이름:</div>
            <div class="detail-value">${app.name}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">이메일:</div>
            <div class="detail-value">${app.email}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">휴대폰:</div>
            <div class="detail-value">${app.phone}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">신청 동기:</div>
            <div class="detail-value motivation-full">${app.motivation}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">상태:</div>
            <div class="detail-value">${status}</div>
        </div>
        <div style="margin-top: 2rem; text-align: center;">
            <button class="action-btn btn-view" onclick="toggleReviewStatus('${app.id}')">
                ${app.reviewed ? '검토 취소' : '검토 완료'}
            </button>
        </div>
    `;
    
    modal.style.display = 'block';
}

// 상세 보기 모달 닫기
function closeDetailModal() {
    document.getElementById('detailModal').style.display = 'none';
}

// 검토 상태 토글
async function toggleReviewStatus(appId) {
    try {
        const app = applications.find(a => a.id === appId);
        const newStatus = !app.reviewed;
        
        await db.collection('applications').doc(appId).update({
            reviewed: newStatus
        });
        
        // 로컬 데이터 업데이트
        app.reviewed = newStatus;
        updateStats();
        renderApplications();
        closeDetailModal();
        
        alert(newStatus ? '검토 완료로 변경되었습니다.' : '검토 취소되었습니다.');
    } catch (error) {
        console.error('상태 변경 실패:', error);
        alert('상태 변경에 실패했습니다.');
    }
}

// 개별 신청 삭제
async function deleteApplication(appId) {
    if (!confirm('정말로 이 신청을 삭제하시겠습니까?')) {
        return;
    }
    
    try {
        await db.collection('applications').doc(appId).delete();
        
        // 로컬 데이터에서 제거
        applications = applications.filter(a => a.id !== appId);
        selectedApplications.delete(appId);
        
        updateStats();
        renderApplications();
        updateBulkDeleteButton();
        
        alert('신청이 삭제되었습니다.');
    } catch (error) {
        console.error('삭제 실패:', error);
        alert('삭제에 실패했습니다.');
    }
}

// 모달 외부 클릭 시 닫기
window.onclick = function(event) {
    const modal = document.getElementById('detailModal');
    if (event.target === modal) {
        closeDetailModal();
    }
} 